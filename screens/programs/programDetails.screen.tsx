import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { programsData } from '@/constants/programsData';

const images = {
  explosivite: require('@/assets/images/explosivite.jpg'),
  ppg: require('@/assets/images/ppg.jpg'),
  prise_de_masse: require('@/assets/images/prise_de_masse.jpg'),
  puissance: require('@/assets/images/puissance.jpg'),
  perte_de_poids: require('@/assets/images/perte_de_poids.jpg'),
} as const;

// Types
type LocationOption = 'à la maison' | 'à la salle';
type DurationType = '1 mois' | '3 mois' | '6 mois';

// Constantes pour les IDs des programmes restreints
const RESTRICTED_PROGRAM_COMBINATIONS = {
  EXPLOSIVITE_ID: 1,
  PUISSANCE_ID: 3,
};

// Fonction utilitaire pour générer un ID unique
const generateUniqueId = () => {
  // Utilisez crypto.randomUUID() si disponible
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: générer un ID unique basé sur le timestamp et un nombre aléatoire
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const ProgramDetailScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams();
  const { handleURLCallback, initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<DurationType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [showSecondProgramModal, setShowSecondProgramModal] = useState(false);
  const [secondProgram, setSecondProgram] = useState<(typeof programsData)[0] | null>(null);

  const currentProgram = {
    id: parseInt(params.id as string, 10),
    title: params.title as string,
    description: params.description as string,
    image: params.image as keyof typeof images,
    priceTiers: JSON.parse(params.priceTiers as string),
  };

  const imageSource = images[currentProgram.image] || images.explosivite;

  // Fonction pour défiler vers le bas
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Gérer le défilement automatique lors de la sélection de la durée
  useEffect(() => {
    if (selectedDuration) {
      scrollToBottom();
    }
  }, [selectedDuration]);

  // Gérer le défilement automatique lors de la sélection du lieu
  useEffect(() => {
    if (selectedLocation) {
      scrollToBottom();
    }
  }, [selectedLocation]);

  // Gérer le défilement automatique lors de la sélection du second programme
  useEffect(() => {
    if (secondProgram) {
      scrollToBottom();
    }
  }, [secondProgram]);

  // Filtrer les programmes disponibles en fonction des restrictions
  const getAvailablePrograms = () => {
    const { EXPLOSIVITE_ID, PUISSANCE_ID } = RESTRICTED_PROGRAM_COMBINATIONS;

    return programsData.filter((program) => {
      // Exclure le programme actuel
      if (program.id === currentProgram.id) return false;

      // Si le programme actuel est Explosivité, exclure Puissance
      if (currentProgram.id === EXPLOSIVITE_ID && program.id === PUISSANCE_ID) return false;

      // Si le programme actuel est Puissance, exclure Explosivité
      if (currentProgram.id === PUISSANCE_ID && program.id === EXPLOSIVITE_ID) return false;

      return true;
    });
  };

  const availablePrograms = getAvailablePrograms();
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (url?.startsWith('perfect://')) {
        try {
          await handleURLCallback(url);
        } catch (error) {
          console.error('Error handling URL callback:', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then(handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [handleURLCallback]);

  const handlePayment = async () => {
    if (!selectedDuration || !selectedLocation) {
      Alert.alert('Erreur', "Veuillez sélectionner une durée et un lieu d'entraînement");
      return;
    }

    setLoading(true);

    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      const getSelectedOption = (program: any, duration: string, location: string) => {
        const tier = program.priceTiers.find((t: any) => t.duration === duration);
        return tier?.options.find((opt: any) => opt.location === location);
      };

      let requestData;
      if (selectedDuration === '6 mois') {
        if (!secondProgram) {
          Alert.alert('Erreur', 'Veuillez sélectionner un second programme');
          setLoading(false);
          return;
        }

        const sixMonthOption = getSelectedOption(currentProgram, '6 mois', selectedLocation);

        if (!sixMonthOption) {
          throw new Error('Option non disponible pour la configuration sélectionnée');
        }

        requestData = {
          programId: sixMonthOption.programId,
          secondProgramId: secondProgram.priceTiers
            .find((t) => t.duration === '3 mois')
            ?.options.find((opt) => opt.location === selectedLocation)?.programId,
          priceId: sixMonthOption.stripePriceId,
          isCombo: true,
        };
      } else {
        const selectedOption = getSelectedOption(
          currentProgram,
          selectedDuration,
          selectedLocation
        );

        if (!selectedOption) {
          throw new Error('Option non disponible pour la configuration sélectionnée');
        }

        requestData = {
          programId: selectedOption.programId,
          priceId: selectedOption.stripePriceId,
          isCombo: false,
        };
      }

      if (!requestData.programId || (requestData.isCombo && !requestData.secondProgramId)) {
        throw new Error('Données de programme manquantes');
      }

      console.log('Request data:', requestData);

      const { data: subscriptionData } = await axios.post(
        `${SERVER_URI}/create-subscription`,
        requestData,
        {
          headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
          },
        }
      );

      // Initialiser le payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Perfect Sport',
        paymentIntentClientSecret: subscriptionData.clientSecret,
      });
      if (initError) {
        throw new Error("Erreur lors de l'initialisation du paiement");
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        throw new Error('Le paiement a échoué');
      }

      await axios.get(`${SERVER_URI}/get-program-content/`, {
        headers: {
          'access-token': accessToken,
          'refresh-token': refreshToken,
        },
      });

      Alert.alert('Succès', 'Votre abonnement a été souscrit avec succès!', [
        {
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: '/(tabs)',
              params: { refresh: 'true' },
            });
          },
        },
      ]);
    } catch (error: any) {
      console.error('Payment error:', error.response?.data || error);

      // Afficher plus de détails dans l'alerte
      Alert.alert(
        'Erreur',
        error.response?.data?.message || error.message || 'Une erreur est survenue',
        [
          {
            text: 'OK',
            onPress: () => console.log('Alert closed'),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const PriceCard = ({ tier, onSelect, isSelected }: any) => (
    <TouchableOpacity
      style={[styles.priceCard, isSelected && styles.selectedPriceCard]}
      onPress={() => onSelect(tier.duration)}
      activeOpacity={0.7}
    >
      <Text style={[styles.durationText, isSelected && styles.selectedText]}>{tier.duration}</Text>
      <Text style={[styles.priceText, isSelected && styles.selectedText]}>
        {tier.price}€ / mois
      </Text>
    </TouchableOpacity>
  );

  const LocationButton = ({ location, isSelected, onPress }: any) => (
    <TouchableOpacity
      style={[styles.locationButton, isSelected && styles.selectedLocationButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.locationText, isSelected && styles.selectedLocationText]}>
        {location}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <ImageBackground source={imageSource} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{currentProgram.title}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{currentProgram.description}</Text>
          <Text style={styles.sectionTitle}>Choisissez une durée</Text>
          {currentProgram.priceTiers.map((tier) => (
            <PriceCard
              key={tier.duration}
              tier={tier}
              onSelect={setSelectedDuration}
              isSelected={selectedDuration === tier.duration}
            />
          ))}
          {selectedDuration && (
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Lieu d'entraînement</Text>
              <View style={styles.locationContainer}>
                <LocationButton
                  location="À la maison"
                  isSelected={selectedLocation === 'à la maison'}
                  onPress={() => setSelectedLocation('à la maison')}
                />
                <LocationButton
                  location="À la salle"
                  isSelected={selectedLocation === 'à la salle'}
                  onPress={() => setSelectedLocation('à la salle')}
                />
              </View>
            </View>
          )}
          {selectedDuration === '6 mois' && selectedLocation && (
            <TouchableOpacity
              style={[
                styles.secondProgramButton,
                secondProgram && styles.selectedSecondProgramButton,
              ]}
              onPress={() => setShowSecondProgramModal(true)}
            >
              <Text style={[styles.buttonText, secondProgram && styles.selectedButtonText]}>
                {secondProgram
                  ? `Programme sélectionné: ${secondProgram.title}`
                  : 'Choisir un second programme'}
              </Text>
            </TouchableOpacity>
          )}
          {selectedDuration &&
            selectedLocation &&
            (selectedDuration !== '6 mois' || secondProgram) && (
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.subscribeButtonText}>Souscrire</Text>
                )}
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>

      <Modal
        visible={showSecondProgramModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSecondProgramModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez un second programme</Text>
            <ScrollView>
              {availablePrograms.map((program) => (
                <TouchableOpacity
                  key={`${program.id}-${generateUniqueId()}`}
                  style={styles.programOption}
                  onPress={() => {
                    setSecondProgram(program);
                    setShowSecondProgramModal(false);
                  }}
                >
                  <Text style={styles.programOptionTitle}>{program.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSecondProgramModal(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
    color: '#000',
  },
  priceCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPriceCard: {
    backgroundColor: '#007AFF',
  },
  durationText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  priceText: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  locationSection: {
    marginTop: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  locationButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  selectedLocationButton: {
    backgroundColor: '#007AFF',
  },
  locationText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedLocationText: {
    color: '#fff',
  },
  secondProgramButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedSecondProgramButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  programOption: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  programOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  programOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProgramDetailScreen;
