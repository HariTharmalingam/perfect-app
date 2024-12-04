import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import useUser from '@/hooks/auth/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Program } from '@/types/programs';
import { router } from 'expo-router';
import Header from '@/components/header/header';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';

const ProgramAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnimation = new Animated.Value(0);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    Animated.spring(rotateAnimation, {
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.Text style={{ transform: [{ rotate }] }}>▼</Animated.Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

export default function UserProgramsPage() {
  const params = useLocalSearchParams();
  const { user } = useUser();
  const [activeProgram, setActiveProgram] = useState(null);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.get(`${SERVER_URI}/get-program-content/`, {
        headers: {
          'access-token': accessToken,
          'refresh-token': refreshToken,
        },
      });
      if (response.data.success) {
        setActiveProgram(response.data.activeProgram || null);
        setUpcomingPrograms(response.data.upcomingPrograms || []);
      } else {
        throw new Error('Failed to fetch programs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Effet pour le chargement initial
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Effet supplémentaire pour détecter le paramètre de rafraîchissement
  useEffect(() => {
    if (params.refresh === 'true') {
      fetchPrograms();
    }
  }, [params.refresh, fetchPrograms]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Une erreur est survenue : {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPrograms}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderWeeks = () => {
    return activeProgram.restructuredWeeks.map((week) => (
      <TouchableOpacity
        key={week.weekNumber}
        style={styles.weekContainer}
        onPress={() => {
          // Création d'un objet simplifié pour la navigation
          const weekDataToPass = {
            weekNumber: week.weekNumber,
            isCurrent: week.isCurrent,
            sessions: week.sessions,
          };

          const serializedWeek = JSON.stringify(weekDataToPass);
          router.push({
            pathname: '/(routes)/user-sessions',
            params: {
              weekData: serializedWeek, // Retirer encodeURIComponent
              programName: activeProgram.name, // Retirer encodeURIComponent
            },
          });
        }}
      >
        <Text style={styles.weekText}>
          Semaine {week.weekNumber} {week.isCurrent ? '(En cours)' : ''}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderActiveProgram = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Programme en cours</Text>
      <ProgramAccordion title={activeProgram.name}>
        <Text style={styles.programDates}>
          Du {new Date(activeProgram.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.programDates}>
          Au {new Date(activeProgram.endDate).toLocaleDateString()}
        </Text>
        <View style={styles.weeksContainer}>{renderWeeks()}</View>
      </ProgramAccordion>
    </View>
  );

  const renderUpcomingPrograms = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Programmes à venir</Text>
      {upcomingPrograms.length > 0 ? (
        upcomingPrograms.map((program) => (
          <TouchableOpacity
            key={`${program._id}-${program.startDate}`}
            style={styles.programItem}
            onPress={() => console.log(`Programme sélectionné : ${program.name}`)}
          >
            <View>
              <Text style={styles.programTitle}>{program.name}</Text>
              <Text style={styles.programDates}>
                Du {new Date(program.startDate).toLocaleDateString()}
              </Text>
              <Text style={styles.programDates}>
                Au {new Date(program.endDate).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noPrograms}>Aucun programme à venir pour le moment.</Text>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 50 }}>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {activeProgram && renderActiveProgram()}
          {renderUpcomingPrograms()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  accordionContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  weeksContainer: {
    gap: 8,
  },
  weekContainer: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  weekText: {
    fontSize: 14,
  },
  programItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  programDates: {
    fontSize: 14,
    color: '#666666',
  },
  noPrograms: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
