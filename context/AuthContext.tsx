import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments, useRootNavigation } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '@/types';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

// Initialize Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  user: UserProfile | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  isAuthenticated: false,
  user: null,
});

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const rootNavigation = useRootNavigation();

  useEffect(() => {
    if (!rootNavigation?.isReady()) return;

    if (!isAuthenticated && segments[0] !== 'login') {
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, rootNavigation]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const setupNetInfo = async () => {
      try {
        if (Platform.OS === 'web') {
          // Web-specific network status handling
          const updateOnlineStatus = () => {
            setIsConnected(navigator.onLine);
          };

          window.addEventListener('online', updateOnlineStatus);
          window.addEventListener('offline', updateOnlineStatus);
          setIsConnected(navigator.onLine);

          return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
          };
        } else {
          // Native platforms
          const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
          });

          // Get initial state using fetch instead of getCurrentState
          const initialState = await NetInfo.fetch();
          setIsConnected(initialState.isConnected);

          return () => {
            unsubscribe();
          };
        }
      } catch (error) {
        console.error('Error setting up network monitoring:', error);
        // Default to connected if we can't determine status
        setIsConnected(true);
      }
    };

    const cleanup = setupNetInfo();
    
    // Initial check of auth state
    checkAuthState();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  useProtectedRoute(isAuthenticated);

  async function checkAuthState() {
    try {
      console.log('Checking auth state...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }

      if (session?.user) {
        console.log('Found existing session');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return;
        }

        if (profile) {
          console.log('Setting authenticated user:', profile.email);
          setUser(profile);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth state check error:', error);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!isConnected) {
        return {
          success: false,
          error: 'Sin conexión a internet. Por favor verifica tu conexión e intenta nuevamente.'
        };
      }

      if (!email || !password) {
        return {
          success: false,
          error: 'Por favor ingresa tu correo y contraseña'
        };
      }

      console.log('Attempting sign in for:', email);

      // Sign in with Supabase
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Handle specific error cases
        if (signInError.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'Correo o contraseña incorrectos. Por favor verifica tus credenciales.'
          };
        }

        if (signInError.message.includes('Email not confirmed')) {
          return {
            success: false,
            error: 'Por favor confirma tu correo electrónico antes de iniciar sesión.'
          };
        }

        return {
          success: false,
          error: 'Error al iniciar sesión. Por favor intenta nuevamente.'
        };
      }

      if (!session) {
        console.error('No session after successful sign in');
        return {
          success: false,
          error: 'Error de autenticación. Por favor intenta nuevamente.'
        };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Error al obtener el perfil de usuario. Por favor intenta nuevamente.'
        };
      }

      console.log('Sign in successful:', profile.email);
      setUser(profile);
      setIsAuthenticated(true);
      return { success: true };

    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return {
        success: false,
        error: 'Error inesperado. Por favor intenta nuevamente.'
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);