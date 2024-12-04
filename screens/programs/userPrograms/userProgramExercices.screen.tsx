import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/header/header';

interface Exercise {
  name: string;
  instructions: string[];
  image?: {
    url: string;
  };
  duration?: string;
  sets?: number;
  reps?: string[];
  rest?: string[];
  distance?: string[];
}

interface Session {
  warmup: {
    name: string;
    exercise: Exercise[];
  };
  exercises: Exercise[];
  instructions: string;
}

const ExerciseSlide = ({ exercise, type }: { exercise: Exercise; type: string }) => {
  return (
    <View style={styles.slide}>
      <Text style={styles.exerciseType}>{type}</Text>
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      {exercise.image?.url && (
        <Image
          source={{ uri: exercise.image.url }}
          style={styles.exerciseImage}
          resizeMode="contain"
        />
      )}

      {exercise.instructions?.length > 0 && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions :</Text>
          {exercise.instructions.map((instruction, idx) => (
            <Text key={idx} style={styles.instruction}>
              • {instruction}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.detailsContainer}>
        {exercise.sets && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Séries</Text>
            <Text style={styles.detailValue}>{exercise.sets}</Text>
          </View>
        )}

        {exercise.reps?.[0] && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Répétitions</Text>
            <Text style={styles.detailValue}>{exercise.reps[0]}</Text>
          </View>
        )}

        {exercise.duration && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Durée</Text>
            <Text style={styles.detailValue}>{exercise.duration}</Text>
          </View>
        )}

        {exercise.rest?.[0] && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Repos</Text>
            <Text style={styles.detailValue}>{exercise.rest[0]}</Text>
          </View>
        )}

        {exercise.distance?.[0] && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{exercise.distance[0]}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function SessionView() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.sessionData) {
      try {
        let sessionData;

        if (typeof params.sessionData === 'string') {
          // Si la chaîne commence et se termine par des guillemets doubles, on les retire
          const cleanedData = params.sessionData.replace(/^"|"$/g, '');
          // Remplacer les guillemets échappés par des guillemets simples
          const unescapedData = cleanedData.replace(/\\"/g, '"');
          sessionData = JSON.parse(unescapedData);
        } else {
          sessionData = params.sessionData;
        }

        if (sessionData && sessionData.warmup && Array.isArray(sessionData.exercises)) {
          setSession(sessionData);
        } else {
          console.error('Invalid session data structure:', sessionData);
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }, [params.sessionData]);

  if (!session) {
    return (
      <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 50 }}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  const allExercises = [
    ...session.warmup.exercise.map((ex) => ({ ...ex, type: 'Échauffement' })),
    ...session.exercises.map((ex) => ({ ...ex, type: 'Exercice' })),
  ];

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 50 }}>
      <Header />
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{params.programName}</Text>
          <Text style={styles.subtitle}>Session {params.sessionNumber}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <ExerciseSlide
            exercise={allExercises[currentSlide]}
            type={allExercises[currentSlide].type}
          />
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
          >
            <Text style={styles.navButtonText}>Précédent</Text>
          </TouchableOpacity>

          <Text style={styles.slideCounter}>
            {currentSlide + 1} / {allExercises.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentSlide === allExercises.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={() => setCurrentSlide(Math.min(allExercises.length - 1, currentSlide + 1))}
            disabled={currentSlide === allExercises.length - 1}
          >
            <Text style={styles.navButtonText}>Suivant</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour aux sessions</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
  },
  sliderContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slide: {
    flex: 1,
  },
  exerciseType: {
    fontSize: 16,
    color: '#2467EC',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666666',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detail: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: '#2467EC',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  slideCounter: {
    fontSize: 14,
    color: '#666666',
  },
  backButton: {
    backgroundColor: '#2467EC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
