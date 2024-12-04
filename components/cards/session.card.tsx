import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface SessionCardProps {
  session: {
    warmup: {
      exercise: any[];
    };
    exercises: any[];
  };
  index: number;
  programName: string;
}

export default function SessionCard({ session, index, programName }: SessionCardProps) {
  const handleSessionPress = () => {
    const sessionData = JSON.stringify(session);
    router.push({
      pathname: '/(routes)/user-exercices',
      params: {
        sessionData,
        sessionNumber: (index + 1).toString(),
        programName,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleSessionPress}>
      <View style={styles.header}>
        <Text style={styles.title}>Session {index + 1}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{session.exercises.length} exercices</Text>
        </View>
      </View>

      {/* Warmup preview */}
      <View style={styles.sectionPreview}>
        <Text style={styles.sectionTitle}>Échauffement :</Text>
        <Text style={styles.sectionDetail}>{session.warmup.exercise.length} exercices</Text>
      </View>

      {/* Exercises preview */}
      <View style={styles.sectionPreview}>
        <Text style={styles.sectionTitle}>Exercices :</Text>
        <View style={styles.exercisesList}>
          {session.exercises.slice(0, 2).map((exercise, exIndex) => (
            <Text key={exIndex} style={styles.exercisePreview}>
              • {exercise.name}
            </Text>
          ))}
          {session.exercises.length > 2 && (
            <Text style={styles.moreExercises}>Et {session.exercises.length - 2} autres...</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  badge: {
    backgroundColor: '#E5ECF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#2467EC',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionPreview: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  sectionDetail: {
    fontSize: 14,
    color: '#666666',
  },
  exercisesList: {
    marginLeft: 4,
  },
  exercisePreview: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  moreExercises: {
    fontSize: 14,
    color: '#2467EC',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
