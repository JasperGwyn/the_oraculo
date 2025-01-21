export enum ModelProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  HUGGINGFACE = 'huggingface'
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  isValid: boolean;
}

export interface EvaluationConfig {
  provider: ModelProvider;
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
}

export interface EvaluationContext {
  question: string;
  answer: string;
  previousResponses?: string[];
  teamContext?: string;
}

export interface PersonalityConfig {
  name: string;
  description: string;
  traits: string[];
  responseExamples: string[];
  evaluationCriteria: {
    humor: number;
    creativity: number;
    relevance: number;
  };
} 