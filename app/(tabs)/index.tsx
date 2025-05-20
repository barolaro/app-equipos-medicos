import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, Tag, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const goToInventory = (filter?: 'verified' | 'pending') => {
    if (filter) {
      router.push(`/tabs/inventory?filter=${filter}`);
    } else {
      router.push('/tabs/inventory');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => goToInventory()}>
        <Box size={36} color="#235A8A" />
        <Text style={styles.title}>5</Text>
        <Text style={styles.subtitle}>Total Equipos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/tabs/categories')}>
        <Tag size={36} color="#235A8A" />
        <Text style={styles.title}>8</Text>
        <Text style={styles.subtitle}>Categorías</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => goToInventory('verified')}>
        <CheckCircle2 size={36} color="#059669" />
        <Text style={styles.title}>2</Text>
        <Text style={styles.subtitle}>Verificados Hoy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => goToInventory('pending')}>
        <AlertCircle size={36} color="#D97706" />
        <Text style={styles.title}>3</Text>
        <Text style={styles.subtitle}>Pendientes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});
