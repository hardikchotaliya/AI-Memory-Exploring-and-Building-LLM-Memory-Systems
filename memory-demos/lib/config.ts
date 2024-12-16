// Model Configurations
export const MODELS = {
  GITHUB: {
    DEFAULT: 'gpt-4o-mini',
    SMART: 'gpt-4', // For more complex tasks
  },
  OPENAI: {
    DEFAULT: 'gpt-4o-mini',
    SMART: 'gpt-4', // For more complex tasks
  },
} as const;

// Context Window Demo Settings
export const CONTEXT_WINDOW = {
  MAX_TOKENS: 4096, // Default for gpt-3.5-turbo
  CHUNK_SIZE: 100, // Tokens to remove when limit is reached
} as const;

// Memory Settings
export const MEMORY_CONFIG = {
  DEFAULT_SYSTEM_MESSAGE: 'You are a helpful assistant.',
  MAX_MEMORY_MESSAGES: 50, // Optional limit for memory size
} as const;

// Types
export type GitHubModel = keyof typeof MODELS.GITHUB;
export type OpenAIModel = keyof typeof MODELS.OPENAI;
