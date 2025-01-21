import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { HfInference } from '@huggingface/inference';
import { 
  EvaluationResult, 
  EvaluationConfig, 
  EvaluationContext,
  ModelProvider 
} from '../types';

export class ResponseEvaluator {
  private config: EvaluationConfig;
  private client: OpenAI | Anthropic | HfInference;

  constructor(config: EvaluationConfig) {
    this.config = config;
    this.client = this.initializeClient();
  }

  private initializeClient() {
    switch (this.config.provider) {
      case ModelProvider.OPENAI:
        return new OpenAI({ apiKey: this.config.apiKey });
      case ModelProvider.ANTHROPIC:
        return new Anthropic({ apiKey: this.config.apiKey });
      case ModelProvider.HUGGINGFACE:
        return new HfInference(this.config.apiKey);
      default:
        throw new Error('Proveedor de modelo no soportado');
    }
  }

  private async generatePrompt(context: EvaluationContext): Promise<string> {
    return `
      Evalúa la siguiente respuesta a una pregunta del Oráculo:
      
      Pregunta: ${context.question}
      Respuesta: ${context.answer}
      
      ${context.teamContext ? `Contexto del equipo: ${context.teamContext}` : ''}
      ${context.previousResponses ? `Respuestas previas:\n${context.previousResponses.join('\n')}` : ''}
      
      Evalúa la respuesta considerando:
      1. Humor y creatividad
      2. Relevancia a la pregunta
      3. Originalidad
      4. Coherencia con el contexto
      
      Formato de respuesta:
      {
        "score": [número entre 0 y 100],
        "feedback": [explicación detallada],
        "isValid": [true/false basado en si cumple criterios mínimos]
      }
    `;
  }

  public async evaluate(context: EvaluationContext): Promise<EvaluationResult> {
    const prompt = await this.generatePrompt(context);

    try {
      let response;
      
      switch (this.config.provider) {
        case ModelProvider.OPENAI:
          response = await (this.client as OpenAI).chat.completions.create({
            model: this.config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: this.config.temperature || 0.7,
            max_tokens: this.config.maxTokens || 500
          });
          return JSON.parse(response.choices[0].message.content || '{}');

        case ModelProvider.ANTHROPIC:
          response = await (this.client as Anthropic).messages.create({
            model: this.config.model,
            max_tokens: this.config.maxTokens || 500,
            temperature: this.config.temperature || 0.7,
            messages: [{ role: 'user', content: prompt }]
          });
          return JSON.parse(response.content[0].text);

        case ModelProvider.HUGGINGFACE:
          response = await (this.client as HfInference).textGeneration({
            model: this.config.model,
            inputs: prompt,
            parameters: {
              max_new_tokens: this.config.maxTokens || 500,
              temperature: this.config.temperature || 0.7
            }
          });
          return JSON.parse(response.generated_text);

        default:
          throw new Error('Proveedor de modelo no soportado');
      }
    } catch (error) {
      console.error('Error al evaluar la respuesta:', error);
      return {
        score: 0,
        feedback: 'Error al procesar la evaluación',
        isValid: false
      };
    }
  }
} 