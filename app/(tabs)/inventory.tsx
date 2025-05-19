import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { InventoryItem, FilterOptions, SortOption } from '@/types';
import { Search, Filter, Plus, ArrowUpDown, Check, X, CircleCheck, CircleAlert } from 'lucide-react-native';
import InventoryListItem from '@/components/InventoryListItem';
import AddEquipmentModal from '@/components/AddEquipmentModal';
import { mockInventoryItems, mockCategories } from '@/utils/mockData';

type SortConfig = {
  field: 'name' | 'createdAt' | 'isVerifiedToday';
  direction: 'asc' | 'desc';
};

type VerificationStatus = 'all' | 'verified' | 'pending';

export default function InventoryScreen() {
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    filter === 'pendientes' ? 'pending' : 'all'
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    query: '',
    category: null,
    lowStock: false,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setItems(mockInventoryItems);
        setIsLoading(false);
      }, 500);
    };

    loadData();
  }, []);

  // Memoized filtered and sorted items
  const processedItems = useMemo(() => {
    let result = [...items];

    // Apply verification status filter
    if (verificationStatus !== 'all') {
      result = result.filter(item => 
        verificationStatus === 'verified' ? item.isVerifiedToday : !item.isVerifiedToday
      );
    }

    // Apply search filter
    if (filterOptions.query) {
      const query = filterOptions.query.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) ||
          (item.sku && item.sku.toLowerCase().includes(query)) ||
          (item.barcode && item.barcode.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterOptions.category) {
      result = result.filter(item => item.category === filterOptions.category);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortConfig.field) {
        case 'name':
          return sortConfig.direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'createdAt':
          return sortConfig.direction === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'isVerifiedToday':
          return sortConfig.direction === 'asc'
            ? (a.isVerifiedToday ? 1 : 0) - (b.isVerifiedToday ? 1 : 0)
            : (b.isVerifiedToday ? 1 : 0) - (a.isVerifiedToday ? 1 : 0);
        default:
          return 0;
      }
    });

    return result;
  }, [items, filterOptions, verificationStatus, sortConfig]);

  const stats = useMemo(() => {
    const total = items.length;
    const verified = items.filter(item => item.isVerifiedToday).length;
    const pending = total - verified;
    return { total, verified, pending };
  }, [items]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar equipos..."
              placeholderTextColor="#94A3B8"
              value={filterOptions.query}
              onChangeText={(text) => setFilterOptions(prev => ({ ...prev, query: text }))}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <ArrowUpDown size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusFilter}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              verificationStatus === 'all' && styles.statusButtonActive
            ]}
            onPress={() => setVerificationStatus('all')}
          >
            <Text style={[
              styles.statusButtonText,
              verificationStatus === 'all' && styles.statusButtonTextActive
            ]}>
              Todos ({stats.total})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              verificationStatus === 'verified' && styles.statusButtonVerified
            ]}
            onPress={() => setVerificationStatus('verified')}
          >
            <CircleCheck 
              size={16} 
              color={verificationStatus === 'verified' ? '#FFFFFF' : '#10B981'} 
              style={styles.statusIcon}
            />
            <Text style={[
              styles.statusButtonText,
              verificationStatus === 'verified' && styles.statusButtonTextActive
            ]}>
              Verificados ({stats.verified})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              verificationStatus === 'pending' && styles.statusButtonPending
            ]}
            onPress={() => setVerificationStatus('pending')}
          >
            <CircleAlert 
              size={16} 
              color={verificationStatus === 'pending' ? '#FFFFFF' : '#F59E0B'} 
              style={styles.statusIcon}
            />
            <Text style={[
              styles.statusButtonText,
              verificationStatus === 'pending' && styles.statusButtonTextActive
            ]}>
              Pendientes ({stats.pending})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {processedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No se encontraron equipos</Text>
          <Text style={styles.emptyMessage}>
            Ajusta los filtros o agrega nuevos equipos al inventario.
          </Text>
        </View>
      ) : (
        <FlatList
          data={processedItems}
          renderItem={({ item }) => (
            <Link href={`/item/${item.id}`} asChild>
              <TouchableOpacity>
                <InventoryListItem item={item} />
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <AddEquipmentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(equipment) => {
          setItems(prev => [...prev, equipment]);
          setShowAddModal(false);
        }}
      />

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar equipos</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.filterLabel}>Categoría</Text>
              <View style={styles.categoryList}>
                {mockCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      filterOptions.category === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setFilterOptions(prev => ({
                      ...prev,
                      category: prev.category === category ? null : category,
                    }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      filterOptions.category === category && styles.categoryButtonTextActive,
                    ]}>
                      {category}
                    </Text>
                    {filterOptions.category === category && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ordenar por</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {[
                { field: 'name', label: 'Nombre' },
                { field: 'createdAt', label: 'Fecha de creación' },
                { field: 'isVerifiedToday', label: 'Estado de verificación' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.field}
                  style={[
                    styles.sortOption,
                    sortConfig.field === option.field && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSortConfig(prev => ({
                      field: option.field as SortConfig['field'],
                      direction: prev.field === option.field && prev.direction === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortConfig.field === option.field && styles.sortOptionTextActive,
                  ]}>
                    {option.label}
                  </Text>
                  {sortConfig.field === option.field && (
                    <ArrowUpDown size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#0F172A',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  statusFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusButtonActive: {
    backgroundColor: '#235A8A',
  },
  statusButtonVerified: {
    backgroundColor: '#10B981',
  },
  statusButtonPending: {
    backgroundColor: '#F59E0B',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  statusIcon: {
    marginRight: 4,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#235A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  modalBody: {
    gap: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#64748B',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  sortOptionActive: {
    backgroundColor: '#2563EB',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
});