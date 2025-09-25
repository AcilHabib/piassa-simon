/* import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

export class AssistantService {
  constructor() {
    this.client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    this.assistantId = process.env.MATCHING_ASSISTANT_ID;
    this.thread = null;
    this.totalTokens = 0;
    this.totalPromptTokens = 0;
    this.totalCompletionTokens = 0;
  }

  async createNewThread() {
    // Delete old thread if it exists
    if (this.thread) {
      try {
        await this.client.beta.threads.del(this.thread.id);
      } catch (error) {
        console.warn('Error deleting old thread:', error);
      }
    }

    // Create new thread
    this.thread = await this.client.beta.threads.create();
    return this.thread;
  }

  async sendMessage(message, timeout = 60000) {
    try {
      if (!this.thread) {
        this.thread = await this.createNewThread();
      }

      // Add the user's message to the thread
      await this.client.beta.threads.messages.create(this.thread.id, {role: 'user', content: message});

      // Run the assistant
      const run = await this.client.beta.threads.runs.create(this.thread.id, {assistant_id: this.assistantId});

      // Wait for completion
      const startTime = Date.now();
      while (true) {
        if (Date.now() - startTime > timeout) {
          console.log('Assistant response timed out');
          return null;
        }

        const runStatus = await this.client.beta.threads.runs.retrieve(this.thread.id, run.id);

        if (runStatus.status === 'completed') {
          // Get the latest message
          const messages = await this.client.beta.threads.messages.list(this.thread.id);

          // Update token usage from the run
          const usage = runStatus.usage;
          if (usage) {
            this.totalTokens += usage.total_tokens;
            this.totalPromptTokens += usage.prompt_tokens;
            this.totalCompletionTokens += usage.completion_tokens;

            console.log('\nToken Usage for Matching:');
            console.log('Prompt tokens:', usage.prompt_tokens);
            console.log('Completion tokens:', usage.completion_tokens);
            console.log('Total tokens:', usage.total_tokens);
          }

          // Return the latest assistant message
          for (const msg of messages.data) {
            if (msg.role === 'assistant') {
              return msg.content[0].text.value;
            }
          }
          return null;
        } else if (runStatus.status === 'failed') {
          console.log('Assistant run failed');
          return null;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }
}
 */
