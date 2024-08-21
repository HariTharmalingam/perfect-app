import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';

async function fetchKey(): Promise<string> {
  try {
    const response = await axios.get(`${SERVER_URI}/stripe-key`);
    return response.data.publishableKey;
  } catch (error) {
    console.error('Erreur lors de la récupération de la clé Stripe:', error);
    throw error;
  }
}

export default fetchKey;
