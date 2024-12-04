import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/header/header';
import SessionCard from '@/components/cards/session.card';

// Définition des types
type Week = {
  weekNumber: number;
  isCurrent: boolean;
  sessions: {
    warmup: {
      name: string;
      exercise: any[];
    };
    exercises: any[];
    instructions: string;
  }[];
};

export default function UserProgramSessions() {
  const [parsedWeekData, setParsedWeekData] = useState<Week | null>(null);
  const params = useLocalSearchParams();
  const programName = Array.isArray(params.programName)
    ? params.programName[0]
    : params.programName || '';

  useEffect(() => {
    if (params.weekData) {
      try {
        // Log pour debugging
        console.log('Raw weekData:', params.weekData);

        // Gestion des différents cas possibles
        let parsed;
        const weekDataString = Array.isArray(params.weekData)
          ? params.weekData[0]
          : params.weekData;

        if (typeof weekDataString === 'string') {
          parsed = JSON.parse(weekDataString);
        } else {
          parsed = weekDataString;
        }

        // Log pour debugging
        console.log('Parsed weekData:', parsed);

        if (parsed && parsed.weekNumber && Array.isArray(parsed.sessions)) {
          setParsedWeekData(parsed);
        } else {
          console.error('Invalid week data structure:', parsed);
        }
      } catch (error) {
        console.error('Error parsing week data:', error);
        // Log l'erreur complète pour debugging
        console.log('Error details:', error);
        console.log('weekData type:', typeof params.weekData);
        console.log('weekData value:', params.weekData);
      }
    }
  }, [params.weekData]);

  if (!parsedWeekData) {
    return (
      <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 50 }}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 50 }}>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{programName}</Text>
            <Text style={styles.subtitle}>
              Semaine {parsedWeekData.weekNumber}
              {parsedWeekData.isCurrent && <Text style={styles.currentBadge}> (En cours)</Text>}
            </Text>
          </View>

          <View style={styles.sessionsContainer}>
            {parsedWeekData.sessions.map((session, index) => (
              <SessionCard key={index} session={session} index={index} programName={programName} />
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour au programme</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
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
  currentBadge: {
    color: '#2467EC',
    fontStyle: 'italic',
  },
  sessionsContainer: {
    gap: 16,
  },
  backButton: {
    backgroundColor: '#2467EC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
