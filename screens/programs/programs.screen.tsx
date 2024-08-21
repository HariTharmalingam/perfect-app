import React from 'react';
import { ScrollView } from 'react-native';
import { Accordion, YStack, Paragraph, Square, YGroup, ListItem, Separator, Text } from 'tamagui';
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { SERVER_URI } from '@/utils/uri';
import axios from 'axios';
import useUser from '@/hooks/auth/useUser';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Exercise = {
  name: string;
  instructions: string[];
  sets?: number;
  reps?: string[];
  rest?: string[];
  duration?: string;
  distance?: string[];
};

type Session = {
  warmup: {
    name: string;
    exercise: Exercise[];
  };
  instructions: string;
  exercises: Exercise[];
};

type Week = {
  weekNumber: number;
  isCurrent: boolean;
  sessions: Session[];
};

type ActiveProgram = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  restructuredWeeks: Week[];
};

type UserActiveProgramProps = {
  activeProgram: ActiveProgram;
};

export default function UserActiveProgramPage({ activeProgram }: UserActiveProgramProps) {
  const { user } = useUser();
  const [programs, setPrograms] = useState<ActiveProgram[]>([]);
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
  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">
          {activeProgram.name}
        </Text>
        <Text>
          Du {new Date(activeProgram.startDate).toLocaleDateString()} au{' '}
          {new Date(activeProgram.endDate).toLocaleDateString()}
        </Text>

        <Accordion type="multiple" width="100%">
          {activeProgram.restructuredWeeks.map((week) => (
            <Accordion.Item key={week.weekNumber} value={`week-${week.weekNumber}`}>
              <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                {({ open }: { open: boolean }) => (
                  <>
                    <Paragraph>
                      Semaine {week.weekNumber} {week.isCurrent ? '(En cours)' : ''}
                    </Paragraph>
                    <Square animation="fast" rotate={open ? '180deg' : '0deg'}>
                      <ChevronDown size="$1" />
                    </Square>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.HeightAnimator animation="medium">
                <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
                  <YGroup separator={<Separator />}>
                    {week.sessions.map((session, sessionIndex) => (
                      <YGroup.Item key={sessionIndex}>
                        <ListItem
                          title={`Session ${sessionIndex + 1}`}
                          subTitle={`${session.exercises.length} exercices`}
                          icon={ChevronRight}
                          onPress={() => {
                            // Ici, vous pouvez naviguer vers une page de détails de la session
                            console.log(
                              `Naviguer vers les détails de la session ${sessionIndex + 1}`
                            );
                          }}
                        />
                      </YGroup.Item>
                    ))}
                  </YGroup>
                </Accordion.Content>
              </Accordion.HeightAnimator>
            </Accordion.Item>
          ))}
        </Accordion>
      </YStack>
    </ScrollView>
  );
}
