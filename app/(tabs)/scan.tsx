import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { FlipHorizontal, ZoomIn, ZoomOut, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ScannedItemModal from '../../components/ScannedItemModal';
import WebScanner from '../../components/WebScanner';
import VerificationFeedback from '../../components/VerificationFeedback';
import { mockInventoryItems } from '../../utils/mockData';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedType, setScannedType] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [showFeedback, setShowFeedback] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setScannedData(data);
    setScannedType(type);

    // Buscar el equipo en el inventario
    const normalizedCode = data.trim().toLowerCase();
    const equipment = mockInventoryItems.find(
      item => item.barcode?.toLowerCase().trim() === normalizedCode
    );

    if (equipment) {
      // Simular actualización del estado de verificación
      equipment.isVerifiedToday = true;
      equipment.lastVerification = new Date();
      
      setVerificationSuccess(true);
      setShowFeedback(true);

      // Ocultar el feedback después de 2 segundos
      setTimeout(() => {
        setShowFeedback(false);
        setScanned(false);
      }, 2000);
    } else {
      setVerificationSuccess(false);
      setShowFeedback(true);

      // Ocultar el feedback después de 2 segundos
      setTimeout(() => {
        setShowFeedback(false);
        setScanned(false);
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setScanned(false);
    setScannedData(null);
    setScannedType(null);
  };

  const handleCloseScan = () => {
    router.back();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const increaseZoom = () => {
    setZoom(current => Math.min(current + 0.1, 1));
  };

  const decreaseZoom = () => {
    setZoom(current => Math.max(current - 0.1, 0));
  };

  if (Platform.OS === 'web') {
    return <WebScanner onScan={handleBarCodeScanned} />;
  }

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need your permission to use the camera for scanning barcodes and QR codes.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_e'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        zoom={zoom}
      >
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCloseScan}
        >
          <X size={24} color="#235A8A" />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={decreaseZoom}>
            <ZoomOut size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <FlipHorizontal size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={increaseZoom}>
            <ZoomIn size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Apunta la cámara al código QR del equipo
          </Text>
        </View>

        {showFeedback && (
          <VerificationFeedback
            success={verificationSuccess}
            message={verificationSuccess ? 'Equipo verificado exitosamente' : 'Código QR no encontrado en el inventario'}
          />
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#235A8A',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  permissionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  permissionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingsButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  settingsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#235A8A',
  },
});