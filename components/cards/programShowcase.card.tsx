import React from 'react';
import { Image } from 'react-native';
import { Card, H2, Paragraph, XStack, YStack, Button } from 'tamagui';

interface ProgramCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onPress: () => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  imageUrl,
  onPress,
}) => {
  return (
    <Card
      elevate
      bordered
      size="$4"
      width={300}
      height={400}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
    >
      <Card.Header padded>
        <H2>{title}</H2>
      </Card.Header>
      <Card.Footer padded>
        <YStack>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: 150, borderRadius: 10 }}
          />
          <Paragraph numberOfLines={3} marginTop="$2">
            {description}
          </Paragraph>
          <Button themeInverse size="$3" marginTop="$2" onPress={onPress}>
            En savoir plus
          </Button>
        </YStack>
      </Card.Footer>
    </Card>
  );
};
