import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

type UserManagementModalProps = {
  visible: boolean;
  onClose: () => void;
  creatorId: string;
};

export default function UserManagementModal({ visible, onClose, creatorId }: UserManagementModalProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'verificador' as 'admin' | 'verificador',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password,
        email_confirm: true,
        user_metadata: {
          name: form.name,
          role: form.role,
        }
      });

      if (authError) throw authError;

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: form.email,
            name: form.name,
            role: form.role,
            created_by: creatorId,
          }
        ]);

      if (profileError) throw profileError;

      Alert.alert(
        'Éxito',
        '✅ Cuenta creada correctamente',
        [{ text: 'OK', onPress: onClose }]
      );

      setForm({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'verificador',
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo crear el usuario. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
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
            <Text style={styles.modalTitle}>Crear Nueva Cuenta</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo *</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => {
                  setForm({ ...form, name: text });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Nombre del usuario"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => {
                  setForm({ ...form, email: text });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="correo@felixbulnes.cl"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => {
                  setForm({ ...form, password: text });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(text) => {
                  setForm({ ...form, confirmPassword: text });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Repite la contraseña"
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    form.role === 'admin' && styles.roleButtonSelected,
                  ]}
                  onPress={() => setForm({ ...form, role: 'admin' })}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      form.role === 'admin' && styles.roleButtonTextSelected,
                    ]}
                  >
                    Administrador
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    form.role === 'verificador' && styles.roleButtonSelected,
                  ]}
                  onPress={() => setForm({ ...form, role: 'verificador' })}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      form.role === 'verificador' && styles.roleButtonTextSelected,
                    ]}
                  >
                    Verificador
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
              onPress={handleCreateUser}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Creando...' : 'Crear Cuenta'}
              </Text>
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
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#235A8A',
  },
  roleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  roleButtonTextSelected: {
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
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});