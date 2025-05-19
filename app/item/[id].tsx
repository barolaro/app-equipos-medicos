import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { InventoryItem } from '@/types';
import { mockInventoryItems } from '@/utils/mockData';
import { Pencil, Trash2, Tag, Package, MapPin, Calendar, Barcode, CircleCheck as CheckCircle, CircleAlert as AlertCircle, User } from 'lucide-react-native';
import EditEquipmentModal from '@/components/EditEquipmentModal';
import SuccessMessage from '@/components/SuccessMessage';
import { useAuth } from '@/context/AuthContext';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simular carga de datos
    const fetchItem = () => {
      setTimeout(() => {
        const foundItem = mockInventoryItems.find(item => item.id === id);
        setItem(foundItem || null);
        setLoading(false);
      }, 500);
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleDelete = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            // Aquí iría la lógica para eliminar el equipo
            setSuccessMessage('Equipo eliminado correctamente 🗑️');
            setShowSuccessMessage(true);
            setTimeout(() => {
              router.back();
            }, 2000);
          } 
        },
      ]
    );
  };

  const handleEditItem = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedEquipment: Partial<InventoryItem>) => {
    if (item) {
      // Aquí iría la lógica para actualizar el equipo en la base de datos
      setItem({ ...item, ...updatedEquipment });
      setShowEditModal(false);
      setSuccessMessage('Equipo actualizado exitosamente ✅');
      setShowSuccessMessage(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando detalles del equipo...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Equipo No Encontrado</Text>
        <Text style={styles.errorMessage}>No se pudo encontrar el equipo solicitado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={48} color="#94A3B8" />
          </View>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>SKU: {item.sku}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditItem}>
            <Pencil size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.verificationSection}>
        <View style={[
          styles.verificationStatus,
          item.isVerifiedToday ? styles.verifiedStatus : styles.pendingStatus
        ]}>
          {item.isVerifiedToday ? (
            <>
              <CheckCircle size={24} color="#10B981" style={styles.statusIcon} />
              <View>
                <Text style={[styles.statusTitle, styles.verifiedTitle]}>Verificado Hoy</Text>
                <Text style={styles.verificationTime}>
                  {item.lastVerification?.toLocaleTimeString()}
                </Text>
                {item.verifiedBy && (
                  <View style={styles.verifierInfo}>
                    <User size={14} color="#059669" style={styles.verifierIcon} />
                    <Text style={styles.verifierText}>{item.verifiedBy}</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <AlertCircle size={24} color="#F59E0B" style={styles.statusIcon} />
              <View>
                <Text style={[styles.statusTitle, styles.pendingTitle]}>Pendiente de Verificación</Text>
                <Text style={styles.statusMessage}>
                  Escanea el código QR para verificar
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.detailsSection}>
        <View style={styles.infoRow}>
          <Tag size={20} color="#64748B" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Categoría:</Text>
          <Text style={styles.infoValue}>{item.category}</Text>
        </View>
        
        {item.location && (
          <View style={styles.infoRow}>
            <MapPin size={20} color="#64748B" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Ubicación:</Text>
            <Text style={styles.infoValue}>{item.location}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Calendar size={20} color="#64748B" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Agregado:</Text>
          <Text style={styles.infoValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Calendar size={20} color="#64748B" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Actualizado:</Text>
          <Text style={styles.infoValue}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        
        {item.barcode && (
          <View style={styles.infoRow}>
            <Barcode size={20} color="#64748B" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Código:</Text>
            <Text style={styles.infoValue}>{item.barcode}</Text>
          </View>
        )}
      </View>
      
      {item.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
      )}

      <EditEquipmentModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        equipment={item}
      />

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onHide={() => setShowSuccessMessage(false)}
        />
      )}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
  },
  itemSku: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  verificationSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  verifiedStatus: {
    backgroundColor: '#ECFDF5',
  },
  pendingStatus: {
    backgroundColor: '#FFFBEB',
  },
  statusIcon: {
    marginRight: 12,
  },
  statusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  verifiedTitle: {
    color: '#10B981',
  },
  pendingTitle: {
    color: '#F59E0B',
  },
  verificationTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#059669',
  },
  statusMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B45309',
  },
  verifierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifierIcon: {
    marginRight: 4,
  },
  verifierText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#059669',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    width: 80,
  },
  infoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
  },
});