import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="payment-result"
        options={{
          title: 'Paiement',
          headerShown: false, // Cacher le header pour cette page
          presentation: 'modal', // Optionnel : afficher comme une modal
        }}
      />
    </Stack>
  );
}
