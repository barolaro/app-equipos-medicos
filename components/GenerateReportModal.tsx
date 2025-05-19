import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { X, FileText } from 'lucide-react-native';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { mockInventoryItems, mockCategories } from '@/utils/mockData';

type GenerateReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function GenerateReportModal({ visible, onClose }: GenerateReportModalProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const generateReport = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      // Configurar fuentes
      doc.setFont('helvetica');

      // Logo y encabezado
      if (Platform.OS !== 'web') {
        const logoUrl = 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/felix-bulnes-logo.png';
        doc.addImage(logoUrl, 'PNG', margin, yPos, 80, 20);
        yPos += 25;
      }

      // Título principal
      doc.setFontSize(18);
      doc.setTextColor(35, 90, 138); // #235A8A
      doc.text('Reporte de Verificación de Equipos', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      doc.setFontSize(16);
      doc.text('Hospital Clínico Félix Bulnes', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Período del reporte
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${months[selectedMonth]} ${selectedYear}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 20;

      // Tabla de resumen
      doc.setFontSize(14);
      doc.setTextColor(35, 90, 138);
      doc.text('Resumen por Categoría', margin, yPos);
      yPos += 10;

      // Encabezados de la tabla
      const headers = ['Categoría', 'Verificados', 'Pendientes'];
      const colWidths = [100, 40, 40];
      const startX = margin;

      // Estilo del encabezado
      doc.setFillColor(35, 90, 138);
      doc.setTextColor(255, 255, 255);
      doc.rect(startX, yPos, colWidths[0] + colWidths[1] + colWidths[2], 8, 'F');
      
      // Texto del encabezado
      doc.setFontSize(11);
      doc.text(headers[0], startX + 4, yPos + 6);
      doc.text(headers[1], startX + colWidths[0] + 4, yPos + 6);
      doc.text(headers[2], startX + colWidths[0] + colWidths[1] + 4, yPos + 6);
      yPos += 8;

      // Datos de la tabla
      doc.setTextColor(0, 0, 0);
      let totalVerified = 0;
      let totalPending = 0;

      mockCategories.forEach((category, index) => {
        const categoryItems = mockInventoryItems.filter(
          item => item.category === category.name
        );
        const verifiedCount = categoryItems.filter(
          item => item.isVerifiedToday
        ).length;
        const pendingCount = categoryItems.length - verifiedCount;

        totalVerified += verifiedCount;
        totalPending += pendingCount;

        // Alternar color de fondo
        if (index % 2 === 0) {
          doc.setFillColor(247, 248, 250);
          doc.rect(startX, yPos, colWidths[0] + colWidths[1] + colWidths[2], 7, 'F');
        }

        doc.text(category.name, startX + 4, yPos + 5);
        doc.text(verifiedCount.toString(), startX + colWidths[0] + 4, yPos + 5);
        doc.text(pendingCount.toString(), startX + colWidths[0] + colWidths[1] + 4, yPos + 5);
        yPos += 7;
      });

      // Totales
      yPos += 3;
      doc.setFillColor(187, 110, 56); // #BB6E38
      doc.rect(startX, yPos, colWidths[0] + colWidths[1] + colWidths[2], 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('Total', startX + 4, yPos + 6);
      doc.text(totalVerified.toString(), startX + colWidths[0] + 4, yPos + 6);
      doc.text(totalPending.toString(), startX + colWidths[0] + colWidths[1] + 4, yPos + 6);

      // Pie de página
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        'Sistema de Verificación de Equipos – Hospital Félix Bulnes',
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      );
      doc.text(
        `Generado el ${new Date().toLocaleDateString('es-CL')}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );

      const fileName = `Reporte_Verificacion_${months[selectedMonth].toLowerCase()}-${selectedYear}.pdf`;

      if (Platform.OS === 'web') {
        doc.save(fileName);
      } else {
        const pdfBase64 = doc.output('datauristring').split(',')[1];
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, pdfBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir Reporte',
          UTI: 'com.adobe.pdf'
        });
      }

      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
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
            <Text style={styles.modalTitle}>Generar Reporte</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Seleccionar Período</Text>
            
            <View style={styles.periodSelector}>
              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>Mes</Text>
                <View style={styles.optionsContainer}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.option,
                        selectedMonth === index && styles.optionSelected
                      ]}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedMonth === index && styles.optionTextSelected
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>Año</Text>
                <View style={styles.optionsContainer}>
                  {years.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.option,
                        selectedYear === year && styles.optionSelected
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedYear === year && styles.optionTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
              <FileText size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.generateButtonText}>Generar PDF</Text>
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
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  periodSelector: {
    marginBottom: 24,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    margin: 4,
  },
  optionSelected: {
    backgroundColor: '#235A8A',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  optionTextSelected: {
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
  generateButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#235A8A',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});