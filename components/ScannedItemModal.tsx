import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

type ScannedItemModalProps = {
  visible: boolean;
  barcodeData: string;
  barcodeType: string;
  onClose: () => void;
  onAddItem: () => void;
};

const ScannedItemModal = ({
  visible,
  barcodeData,
  barcodeType,
  onClose,
  onAddItem,
}: ScannedItemModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Barcode Scanned</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.barcodeTypeLabel}>Type:</Text>
            <Text style={styles.barcodeTypeValue}>{barcodeType}</Text>
            
            <Text style={styles.barcodeDataLabel}>Data:</Text>
            <Text style={styles.barcodeDataValue}>{barcodeData}</Text>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.actionButton} onPress={onAddItem}>
              <Text style={styles.actionButtonText}>Add to Inventory</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  barcodeTypeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  barcodeTypeValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  barcodeDataLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  barcodeDataValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
});

export default ScannedItemModal;