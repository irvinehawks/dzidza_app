import axios from 'axios';
import type { TranslationRequest, TranslationResponse } from '../types';

// Updated API URL to use the inference API endpoint
const API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
};

let requestCount = 0;
let windowStart = Date.now();

// Updated model mapping with correct model IDs
const MODEL_MAPPING: Record<string, string> = {
  'en-de': 'Helsinki-NLP/opus-mt-en-de',
  'de-en': 'Helsinki-NLP/opus-mt-de-en',
  'en-es': 'Helsinki-NLP/opus-mt-en-es',
  'es-en': 'Helsinki-NLP/opus-mt-es-en',
  'en-ru': 'Helsinki-NLP/opus-mt-en-ru',
  'ru-en': 'Helsinki-NLP/opus-mt-ru-en',
};

const huggingfaceService = {
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Validate environment variables
    if (!API_KEY) {
      throw new Error('Hugging Face API key is not configured. Please check your .env file.');
    }

    // Check rate limiting
    const now = Date.now();
    if (now - windowStart >= RATE_LIMIT.timeWindow) {
      requestCount = 0;
      windowStart = now;
    }

    if (requestCount >= RATE_LIMIT.maxRequests) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    const languagePair = `${request.sourceLanguage}-${request.targetLanguage}`;
    const model = MODEL_MAPPING[languagePair];

    if (!model) {
      throw new Error(`Translation between ${request.sourceLanguage} and ${request.targetLanguage} is not supported yet.`);
    }

    try {
      requestCount++;
      
      // Updated request format to match Hugging Face API requirements
      const response = await axios.post(
        `${API_URL}/${model}`,
        { inputs: request.text },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging requests
          timeout: 30000, // 30 seconds
        }
      );

      // Handle different response formats
      let translatedText: string;
      if (Array.isArray(response.data)) {
        // Handle array response format
        translatedText = response.data[0]?.translation_text || response.data[0]?.generated_text || '';
      } else if (typeof response.data === 'object') {
        // Handle object response format
        translatedText = response.data.translation_text || response.data.generated_text || '';
      } else {
        // Handle string response format
        translatedText = response.data;
      }

      if (!translatedText) {
        throw new Error('No translation received from the API');
      }

      return {
        translatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a minute.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        }
        if (error.response?.status === 503) {
          throw new Error('Model is currently loading. Please try again in a few seconds.');
        }
        if (error.response?.status === 404) {
          throw new Error('Translation model not found. Please try a different language pair.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
      }
      
      throw new Error('Failed to translate text. Please try again later.');
    }
  },
};

export default huggingfaceService; 