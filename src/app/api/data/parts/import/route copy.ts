import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import {
  PrismaClient,
  Part,
  Brand,
  ImportExceptionSubject,
} from "@prisma/client";
import { OpenAI } from "openai";
import { z } from "zod";
import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";
import { zodResponseFormat } from "openai/helpers/zod";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Feature flag for testing
const FEATURE_FLAG_SAVE_TO_DB = process.env.FEATURE_FLAG_SAVE_TO_DB === "true";

// Define the combined schema
const ImportSchema = z.object({
  carModel: z.object({
    name: z.string(),
    variants: z.array(z.string()),
    image: z.string(),
  }),
  part: z.object({
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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "");
  }

  // Get all models but exclude image field
  const allModels = await prisma.carModel.findMany({
    select: {
      id: true,
      name: true,
      variants: true,
      brand_id: true,
    },
  });

  // Configure Fuse.js with improved options
  const fuse = new Fuse(allModels, {
    keys: ["name"],
    threshold: 0.3, // More lenient matching
    isCaseSensitive: false,
  });

  // Try exact match with model first if present
  let models = [];
  const splitModels = processedData?.car_model_ids
    ?.split(",")
    .map((m: string) => cleanString(m.trim()));

  for (const modelName of splitModels) {
    const result = fuse.search(modelName);
    console.log("====================================", result);
    // Only take the first match that is below the 0.3 threshold, then stop
    if (result.length > 0) {
      models.push(result[0].item);
      break;
    }
  }

  // if (models.length === 0 && processedData?.part?.model) {
  //   const modelResults = fuse.search(cleanString(processedData.part.model));
  //   if (modelResults.length > 0 && modelResults[0].score < 0.3) {
  //     models = [modelResults[0].item];
  //   }
  // }
  const cleanedDesignation = cleanString(processedData?.designation);
  console.log("[CLEANED DESIGNATION]", cleanedDesignation);

  // If no models found, search in designation
  if (models.length === 0) {
    const words = cleanedDesignation.split(/[\s\/]+/);
    let bestMatch = null;
    let bestScore = 1;

    for (const word of words) {
      const results = fuse.search(word);
      if (results.length > 0 && results[0].score < bestScore) {
        bestScore = results[0].score;
        bestMatch = results[0];
      }
    }

    models = bestMatch && bestMatch.score < 0.6 ? [bestMatch.item] : [];
  }

  // Log Fuse.js results for debugging
  console.log("[FUSE RESULTS]", models);

  // Use stringSimilarity as fallback with lowercase comparison
  if (models.length === 0 && processedData?.designation) {
    const modelMatches = stringSimilarity.findBestMatch(
      cleanString(processedData.designation),
      allModels.map((m) => cleanString(m.name))
    );
    if (modelMatches.bestMatch.rating >= 0.6) {
      models = [allModels[modelMatches.bestMatchIndex]];
    }
  }

  // Log models for debugging
  console.log("[MODELS MATCH]", { models });

  // Get complete models with brand if found
  const foundModels = await prisma.carModel.findMany({
    where: { id: { in: models.map((m) => m.id) } },
    select: {
      id: true,
      name: true,
      variants: true,
      brand_id: true,
    },
  });

  // Search for existing part
  const part =
    foundModels.length > 0
      ? FEATURE_FLAG_SAVE_TO_DB
        ? await prisma.part.findFirst({
            where: {
              store_id,
              ref: String(processedData.ref) || "",
              carModel_ids: { hasSome: foundModels.map((m) => m.id) },
            },
          })
        : {
            // Mock part for test mode
            id: "test-id",
            ref: String(processedData.ref),
            carModel_ids: foundModels.map((m) => m.id),
            store_id,
          }
      : null;

  console.log("[FINAL]", {
    foundModels,
    part,
  });
  return {
    existingModels: foundModels,
    existingPart: part,
  };
}

async function processWithChatGPT(
  data: any[],
  importTicket: any,
  store_id: string
) {
  const allModels = await prisma.carModel.findMany({
    select: {
      id: true,
      name: true,
      variants: true,
      brand_id: true,
    },
  });

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
      YOU ARE A FRENCH CAR PARTS IMPORTER
      ALL THE RAW DATA IN FRENCH AND YOU HAVE TO PROCESS IT IN FRENCH
      Available car models in database:
      ${JSON.stringify(allModels.map((m) => m.name))}

      IMPORTANT: You must ONLY select a model name from the above list.
      
      Process this item and return in this EXACT format:
      {
        "carModel": {
          "name": "MUST be one of the car models listed above",
          "variants": [],
          "image": "N/A"
        },
        "part": {
          "image": "N/A",
          "quantity": 1,
          "sellingPrice": 0,
          "model": "Same as carModel.name",
          "year": 0,
          "ref": "original ref",
          "position": "position",
          "type": "type",
          "designation": Use original text from second column,
          "color": { "name": "N/A", "hex": "N/A" }
        }
      }

      RULES:
      - carModel.name MUST match exactly one of the models listed above
      - Use original text from second column as designation
      - Keep original ref exactly as provided
   
      - Replace Roman numerals with Arabic numerals in car model names

      Process this item: ${JSON.stringify(item)}
      `;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "developer", content: prompt }],
        model: "gpt-4o-mini",
        response_format: zodResponseFormat(ImportSchema, "import_data"),
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("Completion content is null");
      }
      const processed = ImportSchema.parse(JSON.parse(content));

      console.log("[PROCESSED]", {
        ref: processed.part.ref,
        designation: processed.part.designation,
        type: processed.part.type,
        position: processed.part.position,
      });

      // Search for car model from designation
      let searchResults = {};
      try {
        searchResults = await searchExistingRecords(processed, store_id);
      } catch (error) {
        console.error("[ERROR] Failed to search existing records:", error);
        throw new Error("Failed to search existing records");
      }

      if (searchResults.existingModels.length === 0) {
        console.log("[FAILED - MODEL NOT FOUND]", {
          searchedDesignation: processed.part.designation,
          ref: processed.part.ref,
          originalData: item,
        });
        exceptions.push({
          message: "Model not found",
          data: {
            designation: processed.part.designation,
            ref: processed.part.ref,
            originalItem: item,
          },
        });
        continue;
      }

      if (!searchResults.existingPart) {
        try {
          if (FEATURE_FLAG_SAVE_TO_DB) {
            await prisma.part.create({
              data: sanitizePartData(
                processed.part,
                store_id,
                searchResults.existingModels[0].brand_id,
                searchResults.existingModels.map((m) => m.id)
              ),
            });
            successCount++;
            console.log(
              `[SUCCESS] Created part ${successCount}/${data.length}`
            );
          } else {
            console.log(`[TEST MODE] Would create part:`, {
              data: sanitizePartData(
                processed.part,
                store_id,
                searchResults.existingModels[0].brand_id,
                searchResults.existingModels.map((m) => m.id)
              ),
            });
          }
        } catch (createError) {
          console.log("[FAILED - CREATION ERROR]", {
            error: createError.message,
            processedData: processed,
            originalData: item,
          });
          exceptions.push({
            message: "Failed to create part",
            data: {
              error: createError.message,
              processed,
              original: item,
            },
          });
        }
      }
    } catch (error) {
      console.error("[ERROR]", error);
      exceptions.push({
        message: "Processing failed",
        data: { error: error.message, item },
      });
    }
  }

  console.log("[SUMMARY]", {
    total: data.length,
    success: successCount,
    discarded: discardedCount,
    failed: exceptions.length,
  });

  return { successCount, discardedCount, exceptions };
}

async function processImportedData(
  data: any,
  store_id: string,
  ticketId: string
) {
  let successCount = 0;
  const exceptions = [];

  // Log total items to process
  console.log(`[PROCESSING] Total items: ${data.length}`);

  for (const item of data) {
    try {
      const searchResults = await searchExistingRecords(
        {
          model: item.carModel?.name,
          ref: String(item.part?.ref),
        },
        store_id
      );

      // Track result but continue processing
      if (
        !searchResults.existingModels ||
        searchResults.existingModels.length === 0
      ) {
        exceptions.push({
          message: "Model not found",
          data: {
            model: item.carModel?.name,
            ref: item.part?.ref,
            designation: item.part?.designation,
          },
        });
        continue;
      }

      // Only create if part doesn't exist
      if (!searchResults.existingPart) {
        await prisma.part.create({
          data: sanitizePartData(
            item.part,
            store_id,
            searchResults.existingModels[0].brand_id,
            [searchResults.existingModels[0].id]
          ),
        });
        successCount++;
        console.log(`[SUCCESS] Created part ${successCount}/${data.length}`);
      }
    } catch (error) {
      console.error("[ERROR] Processing item:", error);
      exceptions.push({
        message: "Failed to process item",
        data: {
          error: error instanceof Error ? error.message : "Unknown error",
          item,
        },
      });
    }
  }

  // Create all exceptions at once
  if (exceptions.length > 0) {
    await Promise.all(
      exceptions.map((ex) =>
        createImportException(ticketId, ex.message, ex.data)
      )
    );
  }

  console.log("[FINAL] Processing complete:", {
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
    importTicket = await prisma.importTicket.create({ data: {} });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const store_id = formData.get("store_id") as string;

    if (!file || !store_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: file or store_id",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or empty Excel file",
        },
        { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("[FATAL]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        ticketId: importTicket?.id,
      },
      { status: 500 }
    );
  }
}

async function createImportException(
  ticketId: string,
  message: string,
  data: any
) {
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
      subject: "PART", // Use a valid string for the subject
    },
  });
}

function sanitizePartData(
  data: any,
  storeId: string,
  brandId: string,
  carModelIds: string[]
) {
  return {
    image: String(""),
    quantity:
      Number(data?.quantity) > 1 ? 2 : Number(data?.quantity) > 0 ? 1 : 0,
    sellingPrice: Number(data?.sellingPrice) || 0,
    store_id: String(storeId),
    model: String(data?.model || ""),
    year: Number(data?.year) || 0,
    position: String(data?.position || "NONE"),
    color: data?.color || { name: "N/A", hex: "N/A" },
    brand_id: String(brandId),
    carModel_ids: carModelIds.map(String),
    ref: String(data?.ref || ""), // Ensure ref is a string
    type: String(data?.type || "N/A"),
    designation: String(data?.designation || "N/A"),
  };
}
