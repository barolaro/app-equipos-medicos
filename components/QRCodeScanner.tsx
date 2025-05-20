import { Platform } from 'react-native';
import MobileScanner from './MobileScanner';
import WebScanner from './WebScanner';

export default function QRCodeScanner({ onScanned }: { onScanned: (data: string) => void }) {
  return Platform.OS === 'web'
    ? <WebScanner onScanned={onScanned} />
    : <MobileScanner onScanned={onScanned} />;
}
