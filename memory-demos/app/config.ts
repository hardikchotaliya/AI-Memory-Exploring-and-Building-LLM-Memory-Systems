import { MODELS, GitHubModel, OpenAIModel } from '@/lib/config';

export type APIProvider = 'github' | 'openai';

interface Config {
  apiProvider: APIProvider;
  modelName: {
    github: GitHubModel;
    openai: OpenAIModel;
  };
  githubConfig: {
    endpoint: string;
  };
}

const config: Config = {
  apiProvider: 'github', // Change this to 'openai' to use OpenAI API
  modelName: {
    github: 'DEFAULT',
    openai: 'DEFAULT'
  },
  githubConfig: {
    endpoint: 'https://models.inference.ai.azure.com'
  }
};

// Helper function to get current model name based on provider
export const getCurrentModel = () => {
  const provider = config.apiProvider;
  const modelKey = config.modelName[provider];
  return MODELS[provider.toUpperCase() as keyof typeof MODELS][modelKey];
};

export default config; 