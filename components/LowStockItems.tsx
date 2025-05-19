import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { InventoryItem } from '@/types';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Camera, X } from 'lucide-react-native';
import { mockInventoryItems } from '@/utils/mockData';
import { CameraView, CameraType, BarcodeScanningResult } from 'expo-camera';
import VerificationFeedback from './VerificationFeedback';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const LowStockItems = () => {
  const [pendingItems, setPendingItems] = useState(
    mockInventoryItems.filter(item => !item.isVerifiedToday).slice(0, 5)
  );
  const [showCamera, setShowCamera] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!selectedItem || !user) return;

    const normalizedScannedCode = data.trim().toLowerCase();
    const normalizedItemCode = selectedItem.barcode?.trim().toLowerCase() || '';

    if (normalizedScannedCode === normalizedItemCode) {
      // Actualizar el estado del equipo
      const updatedItems = pendingItems.map(item => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            isVerifiedToday: true,
            lastVerification: new Date(),
            verifiedBy: user.name,
            verificationDate: new Date(),
          };
        }
        return item;
      });

      setPendingItems(updatedItems.filter(item => !item.isVerifiedToday));
      setVerificationSuccess(true);
      setFeedbackMessage('Equipo verificado correctamente');
    } else {
      setVerificationSuccess(false);
      setFeedbackMessage('Código QR no corresponde a este equipo');
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setShowCamera(false);
      setSelectedItem(null);
    }, 2000);
  };

  const handleScanPress = (item: InventoryItem) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setSelectedItem(item);
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setSelectedItem(null);
    setShowFeedback(false);
  };

  if (pendingItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Todos los equipos han sido verificados hoy</Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_e'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseCamera}
          >
            <X size={24} color="#235A8A" />
          </TouchableOpacity>

          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Escanea el código QR del equipo
            </Text>
            {selectedItem && (
              <Text style={styles.selectedItemText}>
                {selectedItem.name}
              </Text>
            )}
          </View>

          {showFeedback && (
            <VerificationFeedback
              success={verificationSuccess}
              message={feedbackMessage}
            />
          )}
        </CameraView>
      </View>
    );
  }

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <AlertCircle size={16} color="#F59E0B" />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => handleScanPress(item)}
      >
        <Camera size={16} color="#235A8A" style={styles.scanIcon} />
        <Text style={styles.scanText}>Escanear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={pendingItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E293B',
  },
  itemCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scanIcon: {
    marginRight: 4,
  },
  scanText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#235A8A',
  },
  cameraContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#235A8A',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  instructionContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    backgroundColor: 'rgba(35, 90, 138, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default LowStockItems