import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { DateRange } from '@/types';

type DateRangePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (range: DateRange) => void;
  initialRange: DateRange;
};

export default function DateRangePickerModal({
  visible,
  onClose,
  onSave,
  initialRange,
}: DateRangePickerModalProps) {
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);

  const handleSave = () => {
    onSave({ startDate, endDate });
  };

  // Generar opciones de fechas para los últimos 3 meses
  const dateOptions = [];
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dateOptions.push(date);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Rango de Fechas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.datePickerContainer}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Fecha Inicial</Text>
              <View style={styles.dateOptionsContainer}>
                {dateOptions.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateOption,
                      date.toDateString() === startDate.toDateString() && styles.dateOptionSelected
                    ]}
                    onPress={() => setStartDate(date)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      date.toDateString() === startDate.toDateString() && styles.dateOptionTextSelected
                    ]}>
                      {date.toLocaleDateString('es-CL')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Fecha Final</Text>
              <View style={styles.dateOptionsContainer}>
                {dateOptions.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateOption,
                      date.toDateString() === endDate.toDateString() && styles.dateOptionSelected
                    ]}
                    onPress={() => setEndDate(date)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      date.toDateString() === endDate.toDateString() && styles.dateOptionTextSelected
                    ]}>
                      {date.toLocaleDateString('es-CL')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 20,
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  datePickerContainer: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  dateOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  dateOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    margin: 4,
  },
  dateOptionSelected: {
    backgroundColor: '#235A8A',
  },
  dateOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  dateOptionTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#235A8A',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});