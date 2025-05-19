import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { success, error } = await signIn(email, password);

      if (!success && error) {
        setErrors({ general: error });
      }
    } catch (error) {
      setErrors({ 
        general: 'Ocurrió un error al intentar iniciar sesión. Por favor intenta nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {errors.general && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.general}</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[
            styles.input,
            errors.email && styles.inputError
          ]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          placeholder="correo@felixbulnes.cl"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />
        {errors.email && (
          <Text style={styles.fieldError}>{errors.email}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={[
            styles.input,
            errors.password && styles.inputError
          ]}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          autoComplete="password"
          editable={!isLoading}
        />
        {errors.password && (
          <Text style={styles.fieldError}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          isLoading && styles.loginButtonDisabled
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  fieldError: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#235A8A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});