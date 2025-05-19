import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { User, FileText, Download, Upload, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Trash2, Users } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '@/context/AuthContext';
import EditProfileModal from '@/components/EditProfileModal';
import HelpSupportModal from '@/components/HelpSupportModal';
import GenerateReportModal from '@/components/GenerateReportModal';
import UserManagementModal from '@/components/UserManagementModal';
import { mockInventoryItems } from '@/utils/mockData';
import { utils, write } from 'xlsx';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Tu Nombre',
    email: 'tu.email@ejemplo.com',
  });
  const { signOut, user } = useAuth();

  const isAdmin = user?.email === 'hfbc@hospital.cl' || user?.user_metadata?.user === 'hfbc';

  const handleExportInventory = async () => {
    try {
      const exportData = mockInventoryItems.map(item => ({
        'ID': item.id,
        'Nombre del Equipo': item.name,
        'SKU': item.sku,
        'Código de Barras': item.barcode || '',
        'Categoría': item.category,
        'Ubicación': item.location || '',
        'Descripción': item.description || '',
        'URL de Imagen': item.image || '',
        'Fecha de Registro': new Date(item.createdAt).toLocaleDateString('es-CL'),
        'Fecha Actualización': new Date(item.updatedAt).toLocaleDateString('es-CL'),
        'Última Verificación': item.lastVerification ? new Date(item.lastVerification).toLocaleDateString('es-CL') : '',
        '¿Verificado Hoy?': item.isVerifiedToday ? 'Sí' : 'No'
      }));

      const wb = utils.book_new();
      const ws = utils.json_to_sheet(exportData);
      utils.book_append_sheet(wb, ws, 'Inventario');

      const fileName = `Inventario_HospitalFelixBulnes_${new Date().toISOString().split('T')[0]}.xlsx`;

      if (Platform.OS === 'web') {
        const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const wbout = write(wb, { type: 'base64', bookType: 'xlsx' });
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Exportar Inventario',
          UTI: 'com.microsoft.excel.xlsx'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar el inventario');
    }
  };

  const handleImportInventory = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (result.canceled) return;

      Alert.alert(
        'Importar Inventario',
        '¿Estás seguro de que deseas importar este archivo? Los datos existentes serán actualizados.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Importar',
            onPress: async () => {
              Alert.alert('Éxito', 'Inventario importado correctamente');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo importar el archivo');
    }
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Eliminar Todos los Datos',
      '¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Éxito', 'Todos los datos han sido eliminados');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImagePlaceholder}>
          <User size={32} color="#235A8A" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración de la App</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#64748B" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Notificaciones</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
            thumbColor={notifications ? '#235A8A' : '#94A3B8'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#64748B" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Alertas de Pendientes</Text>
          </View>
          <Switch
            value={lowStockAlerts}
            onValueChange={setLowStockAlerts}
            trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
            thumbColor={lowStockAlerts ? '#235A8A' : '#94A3B8'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleExportInventory}
        >
          <View style={styles.menuItemInfo}>
            <Upload size={20} color="#64748B" style={styles.menuItemIcon} />
            <Text style={styles.menuItemLabel}>Exportar Inventario</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleImportInventory}
        >
          <View style={styles.menuItemInfo}>
            <Download size={20} color="#64748B" style={styles.menuItemIcon} />
            <Text style={styles.menuItemLabel}>Importar Inventario</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setShowGenerateReport(true)}
        >
          <View style={styles.menuItemInfo}>
            <FileText size={20} color="#64748B" style={styles.menuItemIcon} />
            <Text style={styles.menuItemLabel}>Generar Reportes</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Usuarios</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowUserManagement(true)}
          >
            <View style={styles.menuItemInfo}>
              <Users size={20} color="#64748B" style={styles.menuItemIcon} />
              <Text style={styles.menuItemLabel}>🔐 Crear Cuenta (solo admin)</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setShowHelpSupport(true)}
        >
          <View style={styles.menuItemInfo}>
            <HelpCircle size={20} color="#64748B" style={styles.menuItemIcon} />
            <Text style={styles.menuItemLabel}>Ayuda y Soporte</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.dangerSection}>
        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleDeleteAllData}
        >
          <Trash2 size={20} color="#EF4444" style={styles.dangerIcon} />
          <Text style={styles.dangerButtonText}>Borrar Todos los Datos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#64748B" style={styles.dangerIcon} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>

      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={(updatedProfile) => {
          setProfile(updatedProfile);
          setShowEditProfile(false);
        }}
        initialData={profile}
      />

      <HelpSupportModal
        visible={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      <GenerateReportModal
        visible={showGenerateReport}
        onClose={() => setShowGenerateReport(false)}
      />

      {isAdmin && (
        <UserManagementModal
          visible={showUserManagement}
          onClose={() => setShowUserManagement(false)}
          creatorId={user?.id || ''}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#235A8A',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  dangerSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  dangerIcon: {
    marginRight: 8,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
});