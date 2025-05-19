import { View, Text, StyleSheet, Image, Platform, KeyboardAvoidingView } from 'react-native';
import LoginForm from '@/components/LoginForm';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/felix-bulnes-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Sistema de Verificación de Equipos Clínicos
        </Text>

        <LoginForm />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 240,
    height: 80,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#235A8A',
    textAlign: 'center',
    marginBottom: 32,
  },
});