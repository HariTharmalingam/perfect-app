import React from 'react';
import { YStack, Text, Accordion, Paragraph, Square, YGroup, ListItem, Separator } from 'tamagui';
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { Program } from '@/types/programs';

type UserCurrentProgramProps = {
  program: Program;
};

export default function UserCurrentProgram({ program }: UserCurrentProgramProps) {
  return (
    <YStack gap="$4">
      <Text fontSize="$6" fontWeight="bold">
        {program.name}
      </Text>
      <Text>
        Du {new Date(program.startDate).toLocaleDateString()} au{' '}
        {new Date(program.endDate).toLocaleDateString()}
      </Text>

      <Accordion type="multiple" width="100%">
        {program.restructuredWeeks.map((week) => (
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
  );
}
