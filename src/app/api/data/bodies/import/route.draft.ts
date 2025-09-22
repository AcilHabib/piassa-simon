import {NextRequest, NextResponse} from 'next/server';
import * as XLSX from 'xlsx';
import {PrismaClient, Brand, ImportExceptionSubject, Body} from '@prisma/client';
import {OpenAI} from 'openai';
import {z} from 'zod';
import stringSimilarity from 'string-similarity';
import Fuse from 'fuse.js';
import {zodResponseFormat} from 'openai/helpers/zod';

let prisma = new PrismaClient();

async function resetPrismaClient() {
  await prisma.$disconnect();
  prisma = new PrismaClient();
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      console.error(`[PRISMA ATTEMPT ${i + 1}/${retries}]`, error);
      if (error?.code === 'P2010') {
        await resetPrismaClient();
      }
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Feature flag for testing
const FEATURE_FLAG_SAVE_TO_DB = process.env.FEATURE_FLAG_SAVE_TO_DB === 'true';

// Define the combined schema
const ImportSchema = z.object({
  body: z.object({
    image: z.string(),
    quantity: z.number(),
    sellingPrice: z.number(),
    model: z.string(),
    year: z.number(),
    ref: z.string(),
    position: z.string(),
    type: z.string(),
    designation: z.string(),
    color: z.object({
      name: z.string(),
      hex: z.string(),
    }),
  }),
});

async function searchExistingRecords(processedData: any, store_id: string) {
  function cleanString(str: string) {
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/\s+/g, ' ');
  }

  const designation = processedData?.designation ?? '';
  // 2. Clean with guaranteed string input
  const cleanedDesignation = cleanString(designation);
  const designationTerms = cleanedDesignation?.split(/[\s.]+/) || []; // Fix here
  console.log('[CLEANED]', {designation, cleanedDesignation, designationTerms});
  // Get all models but exclude image field
  const allModels = await withRetry(() =>
    prisma.carModel.findMany({
      select: {
        id: true,
        name: true,
        variants: true,
        brand_id: true,
      },
    })
  );
  // Step 1: Generate multi-term combinations from designation (up to 3 terms)
  const termCombinations: string[] = [];
  for (let i = 0; i < designationTerms.length; i++) {
    let combinedTerm = '';
    for (let j = i; j < Math.min(i + 3, designationTerms.length); j++) {
      combinedTerm += (j === i ? '' : ' ') + designationTerms[j];
      termCombinations.push(combinedTerm);
    }
  }
  const fuse = new Fuse(allModels, {
    keys: ['name'],
    threshold: 0.2, // Aggressive matching for partial terms
    includeScore: true,
    isCaseSensitive: false,
    ignoreLocation: true, // Search anywhere in the string
    minMatchCharLength: 2,
    findAllMatches: true,
  });

  // console.log('[FUSE RESULT]', fuse);

  // Search for model in designation
  const fuseResults = termCombinations.flatMap((term) =>
    fuse.search(term).map((result) => ({
      ...result,
      term, // Track which term generated this result
    }))
  );
  const scoredResults = fuseResults
    .filter((result) => result.score && result.score < 0.3)
    .sort((a, b) => {
      // Use the tracked term instead of refIndex
      const aTermLength = a.term.split(' ').length;
      const bTermLength = b.term.split(' ').length;
      return bTermLength - aTermLength || (a.score || 0) - (b.score || 0);
    });
  // Deduplicate and collect models
  const models = scoredResults
    .map((result) => result.item)
    .filter((item, index, self) => self.findIndex((m) => m.id === item.id) === index);

  // Step 5: Fallback for numeric models (e.g., "306 II" → check "306" and "306 2")
  if (models.length === 0) {
    const normalizedDesignation = cleanedDesignation
      .replace(/\b(ii|iii|iv)\b/g, (match) => ` ${match.toUpperCase()} `) // "ii" → " II "
      .replace(/\s+/g, ' ');

    const numericMatches = allModels.filter((model) => {
      const modelName = cleanString(model.name);
      return (
        modelName === normalizedDesignation || // Exact match
        normalizedDesignation.includes(modelName) // Partial match (e.g., "306 II" includes "306")
      );
    });
    models.push(...numericMatches);
  }

  // Get complete models with brand if found
  const foundModels =
    models.length > 0
      ? await prisma.carModel.findMany({
          where: {id: {in: models.map((m) => m.id)}},
          select: {id: true, name: true, variants: true, brand_id: true},
        })
      : [];

  // Search for existing body
  const body =
    foundModels.length > 0
      ? await prisma.body.findFirst({
          where: {
            store_id,
            ref: String(processedData.ref) || '',
            carModel_ids: {hasSome: foundModels.map((m) => m.id)},
          },
        })
      : null;

  return {
    existingModels: foundModels,
    existingBody: body,
  };
}

async function processWithChatGPT(data: any[], importTicket: any, store_id: string) {
  const allModels = await withRetry(() =>
    prisma.carModel.findMany({
      select: {
        id: true,
        name: true,
        variants: true,
        brand_id: true,
      },
    })
  );

  console.log(`[TOTAL] Processing ${data.length} items`);

  let successCount = 0;
  let discardedCount = 0;
  const exceptions = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    console.log(`\n[ITEM ${i + 1}/${data.length}]`, {
      original: item,
    });

    try {
      const prompt = `
      YOU ARE A FRENCH CAR PARTS  IMPORTER
      ALL THE RAW DATA IN FRENCH AND YOU HAVE TO PROCESS IT IN FRENCH
        Available car models in database:
        ${JSON.stringify(allModels.map((m) => m.name))}

        IMPORTANT: You must ONLY select a model name from the above list.
        
        Process this item and return in this EXACT format:
        {
          "body": {
            "image": "N/A",
            "quantity": 1,
            "sellingPrice": 0,
            "model": "Extracted from designation",
            "year": 0,
            "ref": "original ref",
            "position": "position",
            "type": "type",
            "designation": for the designation it's the one value with most characters make it into readable text than try to extract the data afterwards",
            "color": { "name": "N/A", "hex": "N/A" }
          }
        }

        RULES:
        - carModel.name MUST match exactly one of the models listed above
        - Use original text from second column as designation
        - Keep original ref exactly as provided
        - Extract position if present (G/D/AV/AR ...or currentStuff?.store?.id like that ) and provide the full word like D = DROIT or AV = AVANT ...etc.
        - Extract type if present

        Process this item: ${JSON.stringify(item)}
      `;

      const completion = await openai.chat.completions.create({
        messages: [{role: 'developer', content: prompt}],
        model: 'gpt-4o-mini',
        response_format: zodResponseFormat(ImportSchema, 'import_data'),
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Completion content is null');
      }

      const processed = ImportSchema.parse(JSON.parse(content));
      const searchResults = await searchExistingRecords(
        {
          ref: String(processed?.body?.ref) || '',
          designation: processed?.body?.designation || '', // Ensure designation has a default value
        },
        store_id
      );

      console.log('[PROCESSED]', {
        models: searchResults.existingModels.map((m) => m.name),
        ref: processed.body.ref,
        designation: processed.body.designation,
        type: processed.body.type,
        position: processed.body.position,
      });

      // Check for existing body with same ref
      const existingBody = await prisma.body.findFirst({
        where: {
          store_id,
          ref: String(processed.body.ref),
        },
      });

      if (existingBody) {
        console.log('[DISCARDED - DUPLICATE REF]', {
          ref: processed.body.ref,
          designation: processed.body.designation,
          existingBodyId: existingBody.id,
        });
        discardedCount++;
        continue;
      }
      if (!searchResults.existingModels || searchResults.existingModels.length === 0) {
        console.log('[FAILED - MODEL NOT FOUND]', {
          searchedModels: searchResults.existingModels.map((m) => m.name).join(', '),
          ref: processed.body.ref,
          originalData: item,
        });
        exceptions.push({
          message: 'Model not found',
          data: {
            model: searchResults.existingModels.map((m) => m.name).join(', '),
            ref: processed.body.ref,
            designation: processed.body.designation,
            originalItem: item,
          },
        });
        continue;
      }

      if (!searchResults.existingBody) {
        try {
          if (FEATURE_FLAG_SAVE_TO_DB) {
            await prisma.body.create({
              data: sanitizeBodyData(processed.body, store_id, searchResults.existingModels[0].brand_id, [
                searchResults.existingModels[0].id,
              ]),
            });
            successCount++;
            console.log(`[SUCCESS] Created body ${successCount}/${data.length}`);
          } else {
            console.log(`[TEST MODE] Would create body:`, {
              data: sanitizeBodyData(
                processed.body,
                store_id,
                searchResults.existingModels[0].brand_id,
                searchResults.existingModels.map((m) => m.id)
              ),
            });
          }
        } catch (createError) {
          console.log('[FAILED - CREATION ERROR]', {
            error: createError.message,
            processedData: processed,
            originalData: item,
          });
          exceptions.push({
            message: 'Failed to create body',
            data: {
              error: createError.message,
              processed,
              original: item,
            },
          });
        }
      }
    } catch (error) {
      console.error('[ERROR]', error);
      exceptions.push({
        message: 'Processing failed',
        data: {error: error.message, item},
      });
    }
  }

  console.log('[SUMMARY]', {
    total: data.length,
    success: successCount,
    discarded: discardedCount,
    failed: exceptions.length,
  });

  return {successCount, discardedCount, exceptions};
}

async function processImportedData(data: any, store_id: string, ticketId: string) {
  let successCount = 0;
  const exceptions = [];

  // Log total items to process
  console.log(`[PROCESSING] Total items: ${data.length}`);

  for (const item of data) {
    try {
      const searchResults = await searchExistingRecords(
        {
          model: item.carModel?.name,
          ref: String(item.body?.ref),
        },
        store_id
      );

      // Track result but continue processing
      if (!searchResults.existingModels || searchResults.existingModels.length === 0) {
        exceptions.push({
          message: 'Model not found',
          data: {
            model: item.carModel?.name,
            ref: item.body?.ref,
            designation: item.body?.designation,
          },
        });
        continue;
      }

      // Only create if body doesn't exist
      if (!searchResults.existingBody) {
        await prisma.body.create({
          data: sanitizeBodyData(item.body, store_id, searchResults.existingModels[0].brand_id, [
            searchResults.existingModels[0].id,
          ]),
        });
        successCount++;
        console.log(`[SUCCESS] Created body ${successCount}/${data.length}`);
      }
    } catch (error) {
      console.error('[ERROR] Processing item:', error);
      exceptions.push({
        message: 'Failed to process item',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
          item,
        },
      });
    }
  }

  // Create all exceptions at once
  if (exceptions.length > 0) {
    await Promise.all(exceptions.map((ex) => createImportException(ticketId, ex.message, ex.data)));
  }

  console.log('[FINAL] Processing complete:', {
    total: data.length,
    success: successCount,
    exceptions: exceptions.length,
  });

  return {
    successCount,
    exceptionsCount: exceptions.length,
    exceptions,
  };
}

// Main processing logic
export async function POST(request: NextRequest) {
  let importTicket;

  try {
    importTicket = await prisma.importTicket.create({data: {}});

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const store_id = formData.get('store_id') as string;

    if (!file || !store_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: file or store_id',
        },
        {status: 400}
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, {type: 'buffer'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or empty Excel file',
        },
        {status: 400}
      );
    }

    const result = await processWithChatGPT(data, importTicket, store_id);

    return NextResponse.json(
      {
        success: true,
        ticketId: importTicket.id,
        processed: result.successCount,
        failed: result.exceptions.length,
        exceptions: result.exceptions,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('[FATAL]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        ticketId: importTicket?.id,
      },
      {status: 500}
    );
  }
}

async function createImportException(ticketId: string, message: string, data: any) {
  return await prisma.importException.create({
    data: {
      ticket_id: ticketId,
      message,
      data,
      log: {
        timestamp: new Date().toISOString(),
        error: message,
        data: data,
      },
      subject: 'BODY', // Use a valid string for the subject
    },
  });
}

function sanitizeBodyData(data: any, storeId: string, brandId: string, carModelIds: string[]) {
  return {
    image: String(''),
    quantity: Number(data?.quantity) > 1 ? 2 : Number(data?.quantity) > 0 ? 1 : 0,
    sellingPrice: Number(data?.sellingPrice) || 0,
    store_id: String(storeId),
    model: String(data?.model || ''),
    year: Number(data?.year) || 0,
    position: String(data?.position || 'NONE'),
    color: data?.color || {name: 'N/A', hex: 'N/A'},
    brand_id: String(brandId),
    carModel_ids: carModelIds.map(String),
    ref: String(data?.ref || ''), // Ensure ref is a string
    type: String(data?.type || 'N/A'),
    designation: String(data?.designation || 'N/A'),
  };
}
