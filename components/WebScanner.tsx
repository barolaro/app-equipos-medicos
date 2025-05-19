import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { BarcodeScanningResult } from 'expo-camera';
import { Info } from 'lucide-react-native';

type WebScannerProps = {
  onScan: (result: BarcodeScanningResult) => void;
};

const WebScanner = ({ onScan }: WebScannerProps) => {
  const [showNotSupported, setShowNotSupported] = useState(true);

  const simulateScan = () => {
    onScan({
      type: 'org.iso.QRCode',
      data: 'https://example.com/product/12345',
      cornerPoints: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ],
      bounds: {
        origin: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
      },
    });
  };

  return (
    <View style={styles.container}>
      {showNotSupported ? (
        <View style={styles.notSupportedContainer}>
          <Info size={48} color="#235A8A" style={styles.infoIcon} />
          <Text style={styles.notSupportedTitle}>
            Acceso a cámara no disponible en la versión web
          </Text>
          <Text style={styles.notSupportedText}>
            El lector de códigos requiere acceso a la cámara, lo cual no está disponible en esta versión web. 
            Puedes ingresar el código manualmente o utilizar el modo de demostración a continuación.
          </Text>
          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => setShowNotSupported(false)}
          >
            <Text style={styles.demoButtonText}>Continuar en modo demo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Modo Demostración</Text>
          <Text style={styles.demoText}>
            Esta es una demostración de la funcionalidad del escáner.
            En la aplicación móvil, esto accedería a la cámara de tu dispositivo.
          </Text>
          
          <View style={styles.demoActionContainer}>
            <TouchableOpacity 
              style={styles.simulateButton} 
              onPress={simulateScan}
            >
              <Text style={styles.simulateButtonText}>Simular Escaneo QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.simulateButton, styles.barcodeButton]} 
              onPress={() => {
                onScan({
                  type: 'org.gs1.EAN-13',
                  data: '5901234123457',
                  cornerPoints: [],
                  bounds: {
                    origin: { x: 0, y: 0 },
                    size: { width: 100, height: 100 },
                  },
                });
              }}
            >
              <Text style={styles.simulateButtonText}>Simular Escaneo de Código</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.demoNote}>
            Nota: En un dispositivo móvil, verías una vista en vivo de la cámara aquí.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSupportedContainer: {
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  infoIcon: {
    marginBottom: 16,
  },
  notSupportedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#235A8A',
    marginBottom: 12,
    textAlign: 'center',
  },
  notSupportedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  demoButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  demoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  demoContainer: {
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  demoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#235A8A',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  demoActionContainer: {
    width: '100%',
    marginBottom: 32,
  },
  simulateButton: {
    backgroundColor: '#235A8A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  barcodeButton: {
    backgroundColor: '#BB6E38',
  },
  simulateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  demoNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WebScanner;