import axios from 'axios';
import type { TranslationRequest, TranslationResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const translationService = {
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/translate`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  },
};

export default translationService; 