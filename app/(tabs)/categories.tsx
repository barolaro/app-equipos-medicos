import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Category } from '@/types';
import { Plus } from 'lucide-react-native';
import CategoryCard from '@/components/CategoryCard';
import AddCategoryModal from '@/components/AddCategoryModal';
import { mockCategories, mockInventoryItems } from '@/utils/mockData';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Simular carga de datos
    const loadData = () => {
      setTimeout(() => {
        setCategories(mockCategories);
        setIsLoading(false);
      }, 500);
    };

    loadData();
  }, []);

  const getVerificationStats = (categoryName: string) => {
    const categoryItems = mockInventoryItems.filter(item => item.category === categoryName);
    const verifiedCount = categoryItems.filter(item => item.isVerifiedToday).length;
    const pendingCount = categoryItems.length - verifiedCount;
    return { verifiedCount, pendingCount };
  };

  const handlePress = (categoryId: string) => {
    // Navegar a la lista de equipos filtrada por categoría
    console.log(`Categoría presionada: ${categoryId}`);
  };

  const handleAddCategory = (newCategory: { name: string; description?: string }) => {
    const newCategoryItem: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      color: '#235A8A', // Color institucional
      itemCount: 0,
    };

    setCategories(prevCategories => [...prevCategories, newCategoryItem]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay categorías</Text>
          <Text style={styles.emptyMessage}>
            Crea categorías para organizar tus equipos médicos.
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.createButtonText}>Crear Categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => {
            const { verifiedCount, pendingCount } = getVerificationStats(item.name);
            return (
              <CategoryCard
                category={item}
                verifiedCount={verifiedCount}
                pendingCount={pendingCount}
                onPress={() => handlePress(item.id)}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#235A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#235A8A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});