export * from './types';
export * from './core/evaluator';
export * from './core/personality';

// Configuración por defecto
export const defaultConfig = {
  modelProvider: 'openai',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 500
}; 