import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {PartsProcessor} from '@/lib/ai/services/partsProcessor';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('[INFO] Starting to process the request');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const store_id = formData.get('store_id') as string;

    if (!file || !store_id) {
      console.error('[ERROR] Missing file or store_id');
      return NextResponse.json({success: false, error: 'File and store_id are required'}, {status: 400});
    }

    console.log('[INFO] Received file and store_id:', {store_id});

    // Parse Excel file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, {type: 'buffer'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`[INFO] Total items to process: ${data.length}`);

    const processor = new PartsProcessor();
    const results = [];
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const item of data) {
      processedCount++;
      console.log(`[INFO] Processing item ${processedCount}/${data.length}:`, item);

      const result = await processor.processPart(item);
      if (result.error) {
        console.error(`[ERROR] Error processing item ${processedCount}/${data.length}:`, result.error);
        errorCount++;
        continue;
      }

      const {model_body} = result;
      const {designation, car_models, type, position, org_designation, selling_price, reference} = model_body;

      console.log(`[INFO] Extracted model_body for item ${processedCount}/${data.length}:`, model_body);

      try {
        const newRecord = await prisma.body.create({
          data: {
            designation,
            carModel_ids: car_models?.map((model) => model?.car_model_id).filter(Boolean) || [],
            store_id,
            brand_id: item?.brand_id || '',
            ref: reference?.toString() || item?.reference?.toString() || 'N/A',
            org_designation: org_designation || item?.org_designation || 'N/A',
            sellingPrice: selling_price || item?.selling_price || 0,
            quantity: item?.quantity || 1,
            type: type || item?.type || 'N/A',
            position: position || item?.position || 'N/A',
            years: car_models[0]?.years || [],
            // Add other fields as necessary
          },
        });

        console.log(`[INFO] Created new record ${processedCount}/${data.length}:`, newRecord);
        successCount++;
        results.push(newRecord);
      } catch (createError) {
        console.error(`[ERROR] Failed to create record ${processedCount}/${data.length}:`, createError);
        errorCount++;
      }
    }

    console.log('[INFO] Processing summary:');
    console.log(`[INFO] Total items: ${data.length}`);
    console.log(`[INFO] Successfully processed: ${successCount}`);
    console.log(`[INFO] Errors: ${errorCount}`);

    return NextResponse.json(
      {
        success: true,
        results,
        summary: {
          total: data.length,
          success: successCount,
          error: errorCount,
        },
      },
      {status: 201}
    );
  } catch (error) {
    console.error('[ERROR PROCESSING FILE]', error);
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
}
