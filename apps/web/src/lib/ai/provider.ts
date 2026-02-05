/**
 * AI Provider Abstraction
 * Supports DeepSeek, Qwen, or any other provider
 * Never tie code to a single vendor
 */

export interface AIProviderConfig {
  provider: 'deepseek' | 'qwen' | 'openai' | 'local';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface GenerateTextOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface SummarizeOptions {
  text: string;
  maxLength?: number;
  style?: 'bullet' | 'paragraph' | 'brief';
}

export interface ClassifyOptions {
  text: string;
  categories: string[];
  multiLabel?: boolean;
}

export interface ExtractEntitiesOptions {
  text: string;
  entityTypes: string[];
}

export interface AIProviderResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Abstract AI Provider - implement for each vendor
 */
abstract class AIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract generateText(options: GenerateTextOptions): Promise<AIProviderResponse<string>>;
  abstract summarize(options: SummarizeOptions): Promise<AIProviderResponse<string>>;
  abstract classify(options: ClassifyOptions): Promise<AIProviderResponse<string[]>>;
  abstract extractEntities(options: ExtractEntitiesOptions): Promise<AIProviderResponse<Record<string, string[]>>>;
}

/**
 * Mock provider for development/testing
 */
class MockAIProvider extends AIProvider {
  async generateText(options: GenerateTextOptions): Promise<AIProviderResponse<string>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: `[Mock Response] Generated text for: "${options.prompt.slice(0, 50)}..."`,
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    };
  }

  async summarize(options: SummarizeOptions): Promise<AIProviderResponse<string>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const summary = options.style === 'bullet'
      ? `• Key point 1\n• Key point 2\n• Key point 3`
      : `Summary of: "${options.text.slice(0, 100)}..."`;

    return {
      success: true,
      data: summary,
      usage: { promptTokens: 50, completionTokens: 30, totalTokens: 80 },
    };
  }

  async classify(options: ClassifyOptions): Promise<AIProviderResponse<string[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Return first category as mock classification
    const result = options.multiLabel 
      ? options.categories.slice(0, 2)
      : [options.categories[0]];

    return {
      success: true,
      data: result,
      usage: { promptTokens: 20, completionTokens: 5, totalTokens: 25 },
    };
  }

  async extractEntities(options: ExtractEntitiesOptions): Promise<AIProviderResponse<Record<string, string[]>>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const entities: Record<string, string[]> = {};
    options.entityTypes.forEach(type => {
      entities[type] = [`Mock ${type} 1`, `Mock ${type} 2`];
    });

    return {
      success: true,
      data: entities,
      usage: { promptTokens: 30, completionTokens: 20, totalTokens: 50 },
    };
  }
}

/**
 * DeepSeek Provider
 */
class DeepSeekProvider extends AIProvider {
  async generateText(options: GenerateTextOptions): Promise<AIProviderResponse<string>> {
    try {
      const response = await fetch(`${this.config.baseUrl || 'https://api.deepseek.com'}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'deepseek-chat',
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: options.prompt },
          ],
          max_tokens: options.maxTokens || 1024,
          temperature: options.temperature || 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error?.message || 'API error' };
      }

      return {
        success: true,
        data: data.choices[0]?.message?.content || '',
        usage: data.usage,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async summarize(options: SummarizeOptions): Promise<AIProviderResponse<string>> {
    const styleInstructions = {
      bullet: 'Summarize as bullet points:',
      paragraph: 'Summarize in a paragraph:',
      brief: 'Summarize in one sentence:',
    };

    return this.generateText({
      prompt: `${styleInstructions[options.style || 'paragraph']}\n\n${options.text}`,
      maxTokens: options.maxLength || 500,
      systemPrompt: 'You are a concise summarizer. Be brief and accurate.',
    });
  }

  async classify(options: ClassifyOptions): Promise<AIProviderResponse<string[]>> {
    const result = await this.generateText({
      prompt: `Classify the following text into one or more of these categories: ${options.categories.join(', ')}\n\nText: ${options.text}\n\nCategories (comma-separated):`,
      maxTokens: 100,
      systemPrompt: 'You are a text classifier. Only respond with category names, comma-separated.',
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const categories = result.data.split(',').map(c => c.trim()).filter(c => options.categories.includes(c));
    return { success: true, data: categories, usage: result.usage };
  }

  async extractEntities(options: ExtractEntitiesOptions): Promise<AIProviderResponse<Record<string, string[]>>> {
    const result = await this.generateText({
      prompt: `Extract the following entity types from the text: ${options.entityTypes.join(', ')}\n\nText: ${options.text}\n\nRespond in JSON format like: {"entityType": ["entity1", "entity2"]}`,
      maxTokens: 500,
      systemPrompt: 'You are an entity extractor. Only respond with valid JSON.',
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    try {
      const entities = JSON.parse(result.data);
      return { success: true, data: entities, usage: result.usage };
    } catch {
      return { success: false, error: 'Failed to parse entities' };
    }
  }
}

// Provider factory
let currentProvider: AIProvider | null = null;

export function initializeAIProvider(config: AIProviderConfig): void {
  switch (config.provider) {
    case 'deepseek':
      currentProvider = new DeepSeekProvider(config);
      break;
    case 'qwen':
      // TODO: Implement Qwen provider
      currentProvider = new MockAIProvider(config);
      break;
    case 'openai':
      // TODO: Implement OpenAI provider
      currentProvider = new MockAIProvider(config);
      break;
    case 'local':
    default:
      currentProvider = new MockAIProvider(config);
  }

  console.log(`[AIProvider] Initialized with provider: ${config.provider}`);
}

export function getAIProvider(): AIProvider {
  if (!currentProvider) {
    // Default to mock provider if not initialized
    currentProvider = new MockAIProvider({ provider: 'local' });
  }
  return currentProvider;
}

// Convenience functions
export const ai = {
  generateText: (options: GenerateTextOptions) => getAIProvider().generateText(options),
  summarize: (options: SummarizeOptions) => getAIProvider().summarize(options),
  classify: (options: ClassifyOptions) => getAIProvider().classify(options),
  extractEntities: (options: ExtractEntitiesOptions) => getAIProvider().extractEntities(options),
};
