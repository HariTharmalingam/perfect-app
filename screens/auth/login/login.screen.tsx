import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Entypo, FontAwesome, Fontisto, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import { useState } from 'react';
import { commonStyles } from '@/styles/common/common.styles';
import { router } from 'expo-router';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [required, setRequired] = useState('');
  const [error, setError] = useState({
    password: '',
  });

  const [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handlePasswordChange = (value: string) => {
    setUserInfo({ ...userInfo, password: value });
    setError({ ...error, password: '' });
  };

  const handleSignIn = async () => {
    if (!userInfo.email.trim() || !userInfo.password.trim()) {
      setError({
        ...error,
        password: 'Veuillez entrer votre email et mot de passe',
      });
      return;
    }

    setButtonSpinner(true);

    try {
      const res = await axios.post(`${SERVER_URI}/login`, {
        email: userInfo.email,
        password: userInfo.password,
      });

      await AsyncStorage.setItem('access_token', res.data.accessToken);
      await AsyncStorage.setItem('refresh_token', res.data.refreshToken);
      router.push('/(tabs)');
    } catch (err: any) {
      // Gérer les erreurs spécifiques du backend
      if (err.response?.data?.message) {
        // Le backend envoie des messages comme :
        // "Please enter email and password"
        // "Invalid email or password"
        setError({
          ...error,
          password: err.response.data.message,
        });
      } else {
        setError({
          ...error,
          password: 'Erreur de connexion',
        });
      }
    } finally {
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
        <Image style={styles.signInImage} source={require('@/assets/logo.png')} />
        <Text style={[styles.welcomeText, { fontFamily: 'Raleway_700Bold' }]}>Connexion</Text>
        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="Adresse mail"
              placeholderTextColor={'#A1A1A1'}
              onChangeText={(value) => setUserInfo({ ...userInfo, email: value })}
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
            />
            <Fontisto
              style={{ position: 'absolute', left: 26, top: 17.8 }}
              name="email"
              size={20}
              color={'#A1A1A1'}
            />
            {required && (
              <View style={commonStyles.errorContainer}>
                <Entypo name="cross" size={18} color={'red'} />
              </View>
            )}
            <View style={{ marginTop: 15 }}>
              <TextInput
                style={commonStyles.input}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                defaultValue=""
                placeholder="********"
                placeholderTextColor={'#A1A1A1'}
                onChangeText={(value) => {
                  setUserInfo({ ...userInfo, password: value });
                  // Effacer l'erreur quand l'utilisateur commence à taper
                  if (error.password) {
                    setError({ ...error, password: '' });
                  }
                }}
                autoComplete="password"
                textContentType="password"
                autoCapitalize="none"
                value={userInfo.password}
              />
              <TouchableOpacity
                style={styles.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons name="eye-off-outline" size={23} color={'#747474'} />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={'#747474'} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons style={styles.icon2} name="lock" size={20} color={'#A1A1A1'} />
            </View>
            {error.password && (
              <View style={[commonStyles.errorContainer, { top: 145 }]}>
                <Entypo name="cross" size={18} color={'red'} />
                <Text style={{ color: 'red', fontSize: 11, marginTop: -1 }}>{error.password}</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => router.push('/(routes)/forgot-password')}>
              <Text style={[styles.forgotSection, { fontFamily: 'Nunito_600SemiBold' }]}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: '#2467EC',
                marginTop: 15,
              }}
              onPress={handleSignIn}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={'white'} />
              ) : (
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Raleway_700Bold',
                  }}
                >
                  Se connecter
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                gap: 10,
              }}
            >
              <TouchableOpacity>
                <FontAwesome name="google" size={30} />
              </TouchableOpacity>
            </View>

            <View style={styles.signupRedirect}>
              <Text style={{ fontSize: 18, fontFamily: 'Raleway_600SemiBold' }}>
                Pas encore de compte ?
              </Text>
              <TouchableOpacity onPress={() => router.push('/(routes)/sign-up')}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Raleway_600SemiBold',
                    color: '#2467EC',
                    marginLeft: 5,
                  }}
                >
                  S'enregistrer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signInImage: {
    width: '50%',
    height: 150,
    alignSelf: 'center',
    marginTop: 50,
    resizeMode: 'contain',
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 24,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 30,
  },
  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#A1A1A1',
  },
  visibleIcon: {
    position: 'absolute',
    right: 30,
    top: 15,
  },
  icon2: {
    position: 'absolute',
    left: 23,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 16,
    textAlign: 'right',
    fontSize: 16,
    marginTop: 10,
  },
  signupRedirect: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
});
