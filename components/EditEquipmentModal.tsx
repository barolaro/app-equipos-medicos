import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { InventoryItem } from '@/types';
import { mockCategories } from '@/utils/mockData';

type EditEquipmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (equipment: Partial<InventoryItem>) => void;
  equipment: InventoryItem;
};

export default function EditEquipmentModal({ visible, onClose, onSave, equipment }: EditEquipmentModalProps) {
  const [form, setForm] = useState({
    name: equipment.name,
    category: equipment.category,
    location: equipment.location || '',
    barcode: equipment.barcode || '',
    description: equipment.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre del equipo es obligatorio';
    }
    if (!form.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    if (!form.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...equipment,
        ...form,
        updatedAt: new Date(),
      });
    }
  };

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
            <Text style={styles.modalTitle}>Editar Equipo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Equipo *</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => {
                  setForm({ ...form, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
                placeholder="Ej: Monitor de Signos Vitales"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría *</Text>
              <View style={styles.categoryGrid}>
                {mockCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      form.category === category.name && styles.categoryButtonSelected
                    ]}
                    onPress={() => {
                      setForm({ ...form, category: category.name });
                      if (errors.category) {
                        setErrors({ ...errors, category: '' });
                      }
                    }}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      form.category === category.name && styles.categoryButtonTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación *</Text>
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={(text) => {
                  setForm({ ...form, location: text });
                  if (errors.location) {
                    setErrors({ ...errors, location: '' });
                  }
                }}
                placeholder="Ej: Almacén A, Estante 3"
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código de Barras</Text>
              <TextInput
                style={styles.input}
                value={form.barcode}
                onChangeText={(text) => setForm({ ...form, barcode: text })}
                placeholder="Ej: 123456789012"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                placeholder="Descripción del equipo..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
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
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    margin: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#235A8A',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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