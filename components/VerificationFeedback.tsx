import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

type VerificationFeedbackProps = {
  success: boolean;
  message: string;
};

export default function VerificationFeedback({ success, message }: VerificationFeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim },
        success ? styles.successContainer : styles.errorContainer
      ]}
    >
      {success ? (
        <CheckCircle size={24} color="#10B981" />
      ) : (
        <AlertCircle size={24} color="#EF4444" />
      )}
      <Text style={[
        styles.message,
        success ? styles.successMessage : styles.errorMessage
      ]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
  },
  message: {
    marginLeft: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  successMessage: {
    color: '#10B981',
  },
  errorMessage: {
    color: '#EF4444',
  },
});