import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const setupNetworkMonitoring = async () => {
      try {
        if (Platform.OS === 'web') {
          // Web-specific network status handling
          const updateOnlineStatus = () => {
            setIsConnected(navigator.onLine);
            if (navigator.onLine) {
              checkServerConnection();
            }
          };

          window.addEventListener('online', updateOnlineStatus);
          window.addEventListener('offline', updateOnlineStatus);
          
          // Initial check
          setIsConnected(navigator.onLine);
          if (navigator.onLine) {
            checkServerConnection();
          }

          return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
          };
        } else {
          // Native platforms
          const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(!!state.isConnected);
            if (state.isConnected) {
              checkServerConnection();
            }
          });

          // Get initial state without using getCurrentState
          const initialState = await NetInfo.fetch();
          setIsConnected(!!initialState.isConnected);
          if (initialState.isConnected) {
            checkServerConnection();
          }

          return unsubscribe;
        }
      } catch (error) {
        console.error('Error setting up network monitoring:', error);
        // Default to connected state if we can't determine status
        setIsConnected(true);
      }
    };

    setupNetworkMonitoring();
  }, []);

  const checkServerConnection = async () => {
    try {
      setIsRetrying(true);
      const response = await fetch(process.env.EXPO_PUBLIC_SUPABASE_URL + '/rest/v1/', {
        headers: {
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
        },
      });
      setIsConnected(response.ok);
    } catch (error) {
      console.error('Server connection check failed:', error);
      setIsConnected(false);
    } finally {
      setIsRetrying(false);
    }
  };

  return { isConnected, isRetrying };
}