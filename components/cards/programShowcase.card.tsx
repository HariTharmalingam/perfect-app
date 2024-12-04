import React from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import type { ProgramOption, PriceTier, programsDataType } from '@/types/global';

const images = {
  explosivite: require('@/assets/images/explosivite.jpg'),
  ppg: require('@/assets/images/ppg.jpg'),
  prise_de_masse: require('@/assets/images/prise_de_masse.jpg'),
  puissance: require('@/assets/images/puissance.jpg'),
  perte_de_poids: require('@/assets/images/perte_de_poids.jpg'),
} as const;

type ProgramCardProps = Omit<programsDataType, 'id'> & {
  id: string; // On redéfini id en string car on le convertit depuis le number original
};

export default function ProgramCard({
  id,
  title,
  description,
  image,
  priceTiers,
}: ProgramCardProps) {
  const handlePress = () => {
    router.push({
      pathname: '/(routes)/program-details',
      params: {
        id,
        title,
        description,
        image,
        priceTiers: JSON.stringify(priceTiers),
      },
    });
  };

  const imageSource = images[image as keyof typeof images] || images.explosivite;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <ImageBackground source={imageSource} resizeMode="cover" style={styles.imageBackground}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          {/* <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>En savoir plus</Text>
          </TouchableOpacity> */}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.9,
  },
  cardContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,

    // Shadow pour iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow pour Android
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});
