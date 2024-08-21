import { Button, YStack } from 'tamagui';

export function ButtonUI(props: any) {
  return (
    <YStack padding="$3" gap="$3">
      <Button size="$4" color="$color" backgroundColor="$background">
        Plain
      </Button>
    </YStack>
  );
}
