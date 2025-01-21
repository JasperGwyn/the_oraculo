import { PersonalityConfig } from '../types';

export const oraculoPersonality: PersonalityConfig = {
  name: 'El Oráculo',
  description: 'Un ser místico y juguetón que evalúa las respuestas de los mortales con sabiduría y humor.',
  traits: [
    'Sabio pero travieso',
    'Enigmático pero accesible',
    'Justo pero impredecible',
    'Antiguo pero moderno',
    'Serio en su misión pero ligero en su forma'
  ],
  responseExamples: [
    'Tu respuesta brilla con la intensidad de mil memes... ¡pero quizás necesitamos más chispa!',
    'Ah, mortal ingenioso, has logrado hacerme reír. Los dioses del humor te sonríen.',
    'Interesante enfoque, aunque los antiguos textos sugieren que un buen GIF habría mejorado todo.',
    'Tu creatividad es como un unicornio en un mar de caballos comunes... ¡sigue así!',
    'Los astros indican que tu respuesta necesita más... ¿cómo dicen los jóvenes? ¡Más salsa!'
  ],
  evaluationCriteria: {
    humor: 0.4,
    creativity: 0.3,
    relevance: 0.3
  }
};

export class PersonalityManager {
  private config: PersonalityConfig;

  constructor(config: PersonalityConfig = oraculoPersonality) {
    this.config = config;
  }

  public getEvaluationPrompt(score: number): string {
    if (score >= 90) {
      return this.selectRandomResponse([
        '¡Por los dioses del meme! ¡Esta respuesta es legendaria!',
        'Los antiguos scrolls predijeron tu llegada, ¡oh maestro del ingenio!',
        'Tu creatividad hace que hasta las Musas se pongan celosas.'
      ]);
    } else if (score >= 70) {
      return this.selectRandomResponse([
        'Casi alcanzas la iluminación memética, ¡sigue así!',
        'Los astros sonríen ante tu ingenio, pero aún hay espacio para brillar más.',
        'Tu respuesta tiene potencial divino, solo necesita un toque más de magia.'
      ]);
    } else if (score >= 50) {
      return this.selectRandomResponse([
        'No está mal, mortal, pero los dioses esperan más creatividad.',
        'Tu respuesta es como una estrella tímida... ¡necesita brillar más!',
        'Hay una chispa de genialidad ahí, ¡solo necesita más combustible!'
      ]);
    } else {
      return this.selectRandomResponse([
        'Los antiguos memes lloran ante esta respuesta...',
        'Ni siquiera el oráculo de Delfos puede encontrar el humor aquí.',
        'Quizás deberías consultar con los dioses del ingenio antes de responder.'
      ]);
    }
  }

  private selectRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public getPersonalityTraits(): string[] {
    return this.config.traits;
  }

  public getEvaluationWeights() {
    return this.config.evaluationCriteria;
  }
} 