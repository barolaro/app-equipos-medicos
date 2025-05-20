import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockInventoryItems } from '../../utils/mockData';
import InventoryListItem from '../../components/InventoryListItem';

export default function InventoryScreen() {
  const { filter } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState(mockInventoryItems);

  useEffect(() => {
    if (filter === 'verified') {
      const today = new Date().toDateString();
      const verified = mockInventoryItems.filter(
        item => item.isVerifiedToday && new Date(item.lastVerification).toDateString() === today
      );
      setItems(verified);
    } else if (filter === 'pending') {
      const pending = mockInventoryItems.filter(item => !item.isVerifiedToday);
      setItems(pending);
    } else {
      setItems(mockInventoryItems);
    }
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/inventory')} style={styles.filterButton}>
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/inventory?filter=verified')} style={styles.filterButton}>
          <Text style={styles.filterText}>Verificados Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/inventory?filter=pending')} style={styles.filterButton}>
          <Text style={styles.filterText}>Pendientes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InventoryListItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#E2E8F0',
  },
  filterButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
