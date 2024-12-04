import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URI } from '@/utils/uri';

async function fetchKey(): Promise<string> {
  try {
    // Récupérer les tokens d'authentification
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      console.log("Tokens d'authentification manquants");
      return '';
    }

    // Faire la requête avec les tokens d'authentification
    const response = await axios.get(`${SERVER_URI}/stripe-key`, {
      headers: {
        'access-token': accessToken,
        'refresh-token': refreshToken,
      },
    });

    // Vérifier la réponse
    if (response.data && response.data.publishableKey) {
      return response.data.publishableKey;
    } else {
      console.error('Format de réponse invalide:', response.data);
      return '';
    }
  } catch (error) {
    // Logging détaillé de l'erreur
    if (axios.isAxiosError(error)) {
      console.error('Erreur réseau:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('Erreur inattendue:', error);
    }

    // // En développement, vous pouvez retourner une clé de test par défaut
    // if (__DEV__) {
    //   console.log('Utilisation de la clé de test en développement');
    //   return 'pk_test_votre_cle_de_test'; // Remplacer par votre clé de test
    // }

    return '';
  }
}

export default fetchKey;
