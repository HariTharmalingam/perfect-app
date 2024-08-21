import React from 'react';
import { YStack, Text, ListItem } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';

type Program = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type UserUpcomingProgramsProps = {
  programs: Program[];
};

export default function UserUpcomingPrograms({ programs }: UserUpcomingProgramsProps) {
  return (
    <YStack gap="$4">
      <Text fontSize="$5" fontWeight="bold">
        Programmes à venir
      </Text>
      {programs.map((program) => (
        <ListItem
          key={program._id}
          title={program.name}
          subTitle={`Début: ${new Date(program.startDate).toLocaleDateString()}`}
          icon={ChevronRight}
          onPress={() => {
            console.log(`Afficher les détails du programme ${program.name}`);
          }}
        />
      ))}
    </YStack>
  );
}
