import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function NetworkError() {
  const { isConnected, isRetrying } = useNetworkStatus();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRetrying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isRetrying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={48} color="#EF4444" style={styles.icon} />
      <Text style={styles.title}>Error de Conexión</Text>
      <Text style={styles.message}>
        No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.
      </Text>
      <View style={styles.statusContainer}>
        {isRetrying ? (
          <View style={styles.retryingContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={20} color="#235A8A" />
            </Animated.View>
            <Text style={styles.retryingText}>Reconectando...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FEF2F2',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#235A8A',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});