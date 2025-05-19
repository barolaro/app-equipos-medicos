import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { X, Mail, Phone } from 'lucide-react-native';

type HelpSupportModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function HelpSupportModal({ visible, onClose }: HelpSupportModalProps) {
  const faqs = [
    {
      question: '¿Cómo verifico un equipo médico?',
      answer: 'Para verificar un equipo, escanea su código QR usando la función de escaneo en la barra de navegación inferior. También puedes buscar el equipo manualmente en la sección de Inventario.',
    },
    {
      question: '¿Qué hago si un equipo no tiene código QR?',
      answer: 'Si un equipo no tiene código QR, puedes buscarlo manualmente en la sección de Inventario usando su nombre o SKU. Contacta al administrador del sistema para solicitar un nuevo código QR.',
    },
    {
      question: '¿Cómo exporto el inventario?',
      answer: 'Ve a Ajustes y selecciona "Exportar Inventario". Esto generará un archivo Excel con todos los datos actuales del inventario.',
    },
  ];

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
            <Text style={styles.modalTitle}>Ayuda y Soporte</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contacto</Text>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => Linking.openURL('mailto:soporte@felixbulnes.cl')}
              >
                <Mail size={20} color="#235A8A" />
                <Text style={styles.contactText}>soporte@felixbulnes.cl</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => Linking.openURL('tel:+56229484000')}
              >
                <Phone size={20} color="#235A8A" />
                <Text style={styles.contactText}>+56 2 2948 4000</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
              {faqs.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.question}>{faq.question}</Text>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeFullButton} onPress={onClose}>
            <Text style={styles.closeFullButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contactText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#235A8A',
    marginLeft: 12,
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  answer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  closeFullButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  closeFullButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
});