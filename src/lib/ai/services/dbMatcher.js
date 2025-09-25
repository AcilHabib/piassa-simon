/* import { AssistantService } from './assistantService.js';

export class DbMatcher {
    constructor(maxRetries = 2) {
        this.assistant = new AssistantService();
        this.maxRetries = maxRetries;
    }

    async matchCarModel(carModel, attempt = 0) {
        try {
            // Create a new thread for each attempt
            await this.assistant.createNewThread();
            
            console.log(`\nMatching: ${carModel.brand_name} ${carModel.car_model_name}`);
            
            // Send request for this model
            const response = await this.assistant.sendMessage(
                `Match this car model with its database ID: ${carModel.brand_name} ${carModel.car_model_name}`
            );
            
            if (!response) {
                throw new Error('No response from assistant');
            }

            try {
                // Clean up and parse the response
                const cleanResponse = this._cleanJsonResponse(response);
                const matchedData = JSON.parse(cleanResponse);
                
                // Validate the response is an array
                if (!Array.isArray(matchedData)) {
                    throw new Error('Response is not an array');
                }

                // Check if we got a null response
                if (matchedData[0] === null) {
                    throw new Error('Model not found');
                }

                // Get the car_model_id
                const carModelId = matchedData[0];
                
                return {
                    ...carModel,
                    car_model_id: carModelId
                };
            } catch (error) {
                // If we haven't exceeded max retries, try again
                if (attempt < this.maxRetries) {
                    console.log(`Retry ${attempt + 1} for ${carModel.brand_name} ${carModel.car_model_name}`);
                    return this.matchCarModel(carModel, attempt + 1);
                }
                
                console.warn(`Failed to match after ${attempt + 1} attempts for ${JSON.stringify(carModel)}`);
                return this._createFailedMatch(carModel);
            }
        } catch (error) {
            // If we haven't exceeded max retries, try again
            if (attempt < this.maxRetries) {
                console.log(`Retry ${attempt + 1} for ${carModel.brand_name} ${carModel.car_model_name}`);
                return this.matchCarModel(carModel, attempt + 1);
            }
            
            console.error(`Error matching car model after ${attempt + 1} attempts:`, error);
            return this._createFailedMatch(carModel);
        }
    }

    _createFailedMatch(carModel) {
        return {
            ...carModel,
            car_model_id: null
        };
    }

    async matchCarModels(carModels) {
        const matchedModels = [];
        
        for (const carModel of carModels) {
            const matched = await this.matchCarModel(carModel);
            matchedModels.push(matched);
        }
        
        return matchedModels;
    }

    _cleanJsonResponse(response) {
        let cleanResponse = response.trim();
        
        // First try to find a JSON array in the response
        const jsonMatch = response.match(/\[.*?\]/);
        if (jsonMatch) {
            return jsonMatch[0];
        }
        
        // If no JSON found, try cleaning markdown formatting
        if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.split("\n").slice(1).join("\n");
            if (cleanResponse.endsWith("```")) {
                cleanResponse = cleanResponse.split("\n").slice(0, -1).join("\n");
            }
        }
        if (cleanResponse.startsWith("json\n")) {
            cleanResponse = cleanResponse.substring(5);
        }
        
        return cleanResponse;
    }
}
 */
