import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { YStack, Text, Button } from 'tamagui';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import useUser from '@/hooks/auth/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCurrentProgram from '@/components/programs/userCurrent.programs';
import UserUpcomingPrograms from '@/components/programs/userUpcoming.programs';
import { Program } from '@/types/programs';

export default function UserProgramsPage() {
  const { user } = useUser();
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [upcomingPrograms, setUpcomingPrograms] = useState<Program[]>([]);
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
          setCurrentProgram(response.data.activeProgram || null);
          setUpcomingPrograms(response.data.upcomingPrograms || []);
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

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
        <Text>Une erreur est survenue : {error}</Text>
        <Button onPress={() => window.location.reload()}>Réessayer</Button>
      </YStack>
    );
  }

  if (!currentProgram && upcomingPrograms.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
        <Text fontSize="$6" fontWeight="bold">
          Aucun programme prévu
        </Text>
        <Text>Vous n'avez actuellement aucun programme actif ou à venir.</Text>
        <Button
          onPress={() => {
            /* Navigation vers la page de sélection de programme */
          }}
        >
          Choisir un programme
        </Button>
      </YStack>
    );
  }

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        {currentProgram && <UserCurrentProgram program={currentProgram} />}
        {upcomingPrograms.length > 0 && <UserUpcomingPrograms programs={upcomingPrograms} />}
      </YStack>
    </ScrollView>
  );
}
