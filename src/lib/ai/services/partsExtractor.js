/* import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class PartsExtractor {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.client = new OpenAI({apiKey});
    this.totalTokens = 0;
    this.totalPromptTokens = 0;
    this.totalCompletionTokens = 0;
  }

  _getSystemPrompt() {
    return `Extract car part information from the input and return a JSON object with the following structure:
{
    "model_body": {
        "quantity": <number>,
        "selling_price": <number>,
        "type": "<part type in French>",
        "car_models": [
            {
                "brand_name": "<brand name in lowercase - extract from model name if possible>",
                "car_model_name": "<model name - extract from input>",
                "years": [<list of years>]
            }
        ],
        "position": "<position in French>",
        "color": "<color in English>",
        "reference": "<reference number or 0>",
        "designation": "<type + position + specification in French>",
        "org_designation": "<original input>",
        "fabricant": "<manufacturer>",
        "specification": "<additional details>"
    }
}

Notes:
1. For brand_id, try to identify the brand from known car models.
2. For car_model_ids, include the model name as found in the input.
3. If a brand name isn't explicit, but you can match it via the model, use that brand name.`;
  }

  async extractPartInfo(item) {
    try {
      console.log('\nProcessing part ...');
      console.log('Processing:', item);

      // Convert the item to a string before passing it to OpenAI:
      const userPrompt = JSON.stringify(item);

      const response = await this.client.chat.completions.create({
        model: 'ft:gpt-4o-2024-08-06:piassa-dz:piassa:B7k8TxIF',
        messages: [
          {
            role: 'system',
            content: this._getSystemPrompt(),
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      // Update token usage
      const usage = response.usage;
      this.totalTokens += usage.total_tokens;
      this.totalPromptTokens += usage.prompt_tokens;
      this.totalCompletionTokens += usage.completion_tokens;

      console.log('\nToken Usage for Extraction:');
      console.log('Prompt tokens:', usage.prompt_tokens);
      console.log('Completion tokens:', usage.completion_tokens);
      console.log('Total tokens:', usage.total_tokens);

      let content = response.choices[0].message.content;
      // Clean up markdown code blocks if they exist
      content = content.replace(/```json\n|\n```/g, '');

      try {
        return JSON.parse(content);
      } catch (err) {
        console.error('Error in JSON parsing:', err);
        return {
          error: 'Invalid JSON response',
          raw_content: content,
        };
      }
    } catch (error) {
      console.error('Error in extractPartInfo:', error);
      return {error: error.message};
    }
  }
}
 */
