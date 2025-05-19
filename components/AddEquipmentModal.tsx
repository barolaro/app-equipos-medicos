import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Camera, Package } from 'lucide-react-native';
import { mockCategories } from '@/utils/mockData';

type AddEquipmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (equipment: any) => void;
};

export default function AddEquipmentModal({ visible, onClose, onSave }: AddEquipmentModalProps) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    location: '',
    description: '',
  });

  const handleSave = () => {
    if (!form.name || !form.sku || !form.category || !form.location) {
      // Mostrar error de validación
      return;
    }

    onSave({
      ...form,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerifiedToday: false,
      lastVerification: null,
    });

    // Limpiar formulario
    setForm({
      name: '',
      sku: '',
      category: '',
      location: '',
      description: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar Nuevo Equipo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.imageSection}>
              <View style={styles.imagePlaceholder}>
                <Package size={48} color="#94A3B8" />
              </View>
              <TouchableOpacity style={styles.addImageButton}>
                <Camera size={20} color="#FFFFFF" />
                <Text style={styles.addImageText}>Agregar Imagen</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Equipo *</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                placeholder="Ej: Monitor de Signos Vitales"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SKU *</Text>
              <TextInput
                style={styles.input}
                value={form.sku}
                onChangeText={(text) => setForm({ ...form, sku: text })}
                placeholder="Ej: MSV-2024-001"
              />
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
                    onPress={() => setForm({ ...form, category: category.name })}
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación *</Text>
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={(text) => setForm({ ...form, location: text })}
                placeholder="Ej: Almacén A, Estante 3"
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#235A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addImageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
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