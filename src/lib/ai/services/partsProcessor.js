import {PartsExtractor} from './partsExtractor.js';
import {DbMatcher} from './dbMatcher.js';

export class PartsProcessor {
  constructor() {
    this.extractor = new PartsExtractor();
    this.matcher = new DbMatcher();
  }

  async processPart(item) {
    try {
      console.log('\n[PartsProcessor] Processing part with item:', item);

      // 1) Extract info using OpenAI
      const extractedInfo = await this.extractor.extractPartInfo(item);
      if (extractedInfo.error) {
        return extractedInfo;
      }

      // 2) modelBody from the extracted data
      const modelBody = extractedInfo.model_body || {};
      const originalCarModels = modelBody.car_models || [];
      console.log('[PartsProcessor] Original car_models from extraction:', originalCarModels);

      // 3) Prepare data for DB matching
      //    (Use brand_name, car_model_name, etc., from extracted info)
      const rawCarModels = originalCarModels.map((m) => {
        return {
          brand_name: m.brand_name,
          car_model_name: m.car_model_name,
          years: m.years,
          // If you parse out year or anything else, do it here
        };
      });

      // 4) If we have any car models, run them through the matcher
      if (rawCarModels.length > 0) {
        const matchedModels = await this.matcher.matchCarModels(rawCarModels);
        console.log('[PartsProcessor] matchedModels from dbMatcher:', matchedModels);

        // 5) Instead of storing matched_models separately,
        //    directly overwrite model_body.car_models with the matched docs
        modelBody.car_models = matchedModels;
      } else {
        console.warn('[PartsProcessor] No car_models found in modelBody.');
      }

      // 6) Return the entire model_body so route.ts can insert it
      return {model_body: modelBody};
    } catch (error) {
      console.error('Error processing description:', error);
      return {error: error.message};
    }
  }
}
