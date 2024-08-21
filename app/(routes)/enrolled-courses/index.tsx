import ProgramCard from '@/components/cards/program.card';
import Loader from '@/components/loader/loader';
import useUser from '@/hooks/auth/useUser';
import { SERVER_URI } from '@/utils/uri';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserPrograms() {
  interface Exercise {
    exerciseNumber: number;
    exerciseName: string;
    exerciseDescription: string;
    image: string;
    sets: number;
    reps?: string[];
    rest?: string[];
    duration?: string[];
  }

  interface Session {
    sessionNumber: number;
    warmup?: string;
    instructions: string;
    sessionType?: string;
    exercises: Exercise[];
  }

  interface Week {
    weekNumber: number;
    isCurrent: boolean;
    sessions: Session[];
  }

  interface Program {
    _id: string;
    id: number;
    name: string;
    currentProgramWeek: number;
    weeks: Week[];
  }
  const { user } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user) return;

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
          setPrograms(response.data.programs);
        } else {
          throw new Error('Failed to fetch programs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [user]);

  const renderExercise = ({ item }: { item: Exercise }) => (
    <View style={styles.exercise}>
      <Text style={styles.exerciseName}>{item.exerciseName}</Text>
      <Text>Sets: {item.sets}</Text>
      <Text>Reps: {item.reps?.join(', ')}</Text>
      <Text>Rest: {item.rest?.join(', ')}</Text>
    </View>
  );

  const renderSession = ({ item }: { item: Session }) => (
    <View style={styles.session}>
      <Text style={styles.sessionTitle}>Session {item.sessionNumber}</Text>
      <Text>{item.instructions}</Text>
      <FlatList
        data={item.exercises}
        renderItem={renderExercise}
        keyExtractor={(exercise) => `${exercise.exerciseNumber}`}
      />
    </View>
  );

  const renderWeek = ({ item }: { item: Week }) => (
    <View style={[styles.week, item.isCurrent && styles.currentWeek]}>
      <Text style={styles.weekTitle}>Week {item.weekNumber}</Text>
      <FlatList
        data={item.sessions}
        renderItem={renderSession}
        keyExtractor={(session) => `${session.sessionNumber}`}
      />
    </View>
  );

  const renderProgram = ({ item }: { item: Program }) => (
    <View style={styles.program}>
      <Text style={styles.programTitle}>{item.name}</Text>
      <Text>Current Week: {item.currentProgramWeek}</Text>
      <FlatList
        data={item.weeks}
        renderItem={renderWeek}
        keyExtractor={(week) => `${week.weekNumber}`}
        horizontal
        pagingEnabled
      />
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList data={programs} renderItem={renderProgram} keyExtractor={(program) => program._id} />
  );
}

const styles = StyleSheet.create({
  program: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  week: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
  },
  currentWeek: {
    backgroundColor: '#d0d0ff',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  session: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: '#f8f8f8',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercise: {
    marginVertical: 2,
    padding: 5,
    backgroundColor: '#fff',
  },
  exerciseName: {
    fontWeight: 'bold',
  },
});
