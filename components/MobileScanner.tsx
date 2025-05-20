import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text } from 'react-native';

export default function MobileScanner({ onScanned }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <Text>Solicitando permiso de cámara...</Text>;
  if (hasPermission === false) return <Text>Acceso a cámara denegado</Text>;

  return (
    <BarCodeScanner
      onBarCodeScanned={({ data }) => onScanned(data)}
      style={{ width: '100%', height: 300 }}
    />
  );
}
