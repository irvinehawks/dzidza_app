export interface Language {
  code: string;
  name: string;
  isUpcoming?: boolean;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface LearningResource {
  name: string;
  type: 'institution' | 'online' | 'book';
  location?: string;
  url?: string;
  description: string;
} 