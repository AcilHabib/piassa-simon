import {PartsProcessor} from './services/partsProcessor.js';
import * as XLSX from 'xlsx';
import fs from 'fs';

async function processExcelFile(filePath, store_id, type) {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, {type: 'buffer'});
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);

  const processor = new PartsProcessor();
  const results = [];

  for (const item of data) {
    const result = await processor.processPart(item);
    if (result.error) {
      console.error('Error processing item:', result.error);
      continue;
    }

    const {model_body} = result;
    const {designation, car_models} = model_body;

    results.push({
      designation,
      carModel_ids: car_models.map((model) => model.car_model_id),
      store_id,
      // Add other fields as necessary
    });
  }

  console.log('Processed results:', results);
  return results;
}

async function main() {
  const filePath = 'path/to/your/excel/file.xlsx';
  const store_id = 'your-store-id';
  await processExcelFile(filePath, store_id);
}

main().catch((error) => {
  console.error('Error in main:', error);
  process.exit(1);
});
