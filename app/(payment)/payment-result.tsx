import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';

export default function PaymentResult() {
  const { handleURLCallback } = useStripe();
  const params = useLocalSearchParams();

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        console.log('Processing payment result with params:', params);

        if (params.redirect_status === 'succeeded') {
          // Paiement réussi
          setTimeout(() => {
            router.push('/(tabs)');
          }, 1500);
        } else {
          // Paiement échoué ou autre statut
          setTimeout(() => {
            router.back();
          }, 1500);
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    };

    processPaymentResult();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
      <Text style={styles.text}>Traitement du paiement en cours...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
