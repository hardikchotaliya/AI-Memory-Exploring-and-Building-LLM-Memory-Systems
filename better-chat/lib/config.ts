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

// Types
export type GitHubModel = keyof typeof MODELS.GITHUB;
export type OpenAIModel = keyof typeof MODELS.OPENAI;
