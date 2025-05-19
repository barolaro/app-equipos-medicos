import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Calendar, Download, Search, Filter, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { VerificationRecord, DateRange } from '@/types';
import DateRangePickerModal from '@/components/DateRangePickerModal';
import { mockVerificationHistory } from '@/utils/mockData';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { utils, write } from 'xlsx';

type FilterState = {
  category: string | null;
  status: 'all' | 'verified' | 'pending';
};

export default function HistoryScreen() {
  const [records, setRecords] = useState<VerificationRecord[]>(mockVerificationHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    status: 'all',
  });

  // Filtrar registros basado en búsqueda y filtros
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // Filtro por búsqueda
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        record.equipmentName.toLowerCase().includes(searchLower) ||
        record.verifiedBy.toLowerCase().includes(searchLower);

      // Filtro por fecha
      const recordDate = new Date(record.verificationDate);
      const isInDateRange = 
        recordDate >= dateRange.startDate &&
        recordDate <= dateRange.endDate;

      // Filtro por categoría
      const matchesCategory = 
        !filters.category || 
        record.category === filters.category;

      return matchesSearch && isInDateRange && matchesCategory;
    });
  }, [records, searchQuery, dateRange, filters]);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setShowDatePicker(false);
  };

  const exportToExcel = async () => {
    try {
      const exportData = filteredRecords.map(record => ({
        'Equipo': record.equipmentName,
        'Categoría': record.category,
        'Código': record.barcode,
        'Fecha': new Date(record.verificationDate).toLocaleDateString('es-CL'),
        'Hora': new Date(record.verificationDate).toLocaleTimeString('es-CL'),
        'Verificado por': record.verifiedBy,
      }));

      const wb = utils.book_new();
      const ws = utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 30 }, // Equipo
        { wch: 20 }, // Categoría
        { wch: 15 }, // Código
        { wch: 12 }, // Fecha
        { wch: 10 }, // Hora
        { wch: 25 }, // Verificado por
      ];
      ws['!cols'] = colWidths;

      utils.book_append_sheet(wb, ws, 'Verificaciones');

      const fileName = `Historial_Verificaciones_${new Date().toISOString().split('T')[0]}.xlsx`;

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
          dialogTitle: 'Exportar Historial',
          UTI: 'com.microsoft.excel.xlsx'
        });
      }
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  };

  const renderItem = ({ item }: { item: VerificationRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <View style={styles.recordTitleContainer}>
          <Text style={styles.equipmentName}>{item.equipmentName}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.verificationStatus}>
          <CheckCircle size={16} color="#10B981" />
          <Text style={styles.verificationText}>Verificado</Text>
        </View>
      </View>
      
      <View style={styles.recordDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Código:</Text>
          <Text style={styles.detailValue}>{item.barcode}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.verificationDate).toLocaleDateString('es-CL')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Hora:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.verificationDate).toLocaleTimeString('es-CL')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Verificado por:</Text>
          <Text style={styles.detailValue}>{item.verifiedBy}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por equipo o usuario..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.dateRangeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#235A8A" />
            <Text style={styles.dateRangeText}>
              {`${dateRange.startDate.toLocaleDateString('es-CL')} - ${dateRange.endDate.toLocaleDateString('es-CL')}`}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={exportToExcel}
          >
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredRecords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No se encontraron registros</Text>
          <Text style={styles.emptyMessage}>
            Ajusta los filtros o realiza una nueva búsqueda
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <DateRangePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSave={handleDateRangeChange}
        initialRange={dateRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateRangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#235A8A',
    marginLeft: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#235A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  equipmentName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  recordDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    width: 100,
  },
  detailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
});