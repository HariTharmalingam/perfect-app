import { View, Text, StyleSheet } from 'react-native';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import { useFonts } from 'expo-font';
import { usePathname } from 'expo-router';

export default function Header() {
  const pathname = usePathname();

  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
  });

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Accueil';
      case '/programs':
        return 'Mes Programmes';
      case '/profile':
        return 'Mon Profil';
      default:
        return '';
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: 'Raleway_700Bold' }]}>{getTitle()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E2E5',
  },
  title: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
});
