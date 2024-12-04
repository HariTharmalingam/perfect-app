import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgramCard from '@/components/cards/programShowcase.card';
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway';
import { Nunito_600SemiBold, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { programsData } from '@/constants/programsData';

export default function AllPrograms() {
  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
    Nunito_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.programsContainer}>
        {programsData.map((program) => (
          <ProgramCard
            key={program.id}
            id={program.id.toString()}
            title={program.title}
            description={program.description}
            image={program.image}
            priceTiers={program.priceTiers}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  programsContainer: {
    padding: 16,
    gap: 16,
  },
});
