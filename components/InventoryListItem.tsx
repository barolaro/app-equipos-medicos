import { View, Text, StyleSheet, Image } from 'react-native';
import { InventoryItem } from '@/types';
import { Package, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

type InventoryListItemProps = {
  item: InventoryItem;
};

const InventoryListItem = ({ item }: InventoryListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={24} color="#94A3B8" />
          </View>
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sku}>SKU: {item.sku}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          item.isVerifiedToday ? styles.verifiedBadge : styles.pendingBadge
        ]}>
          {item.isVerifiedToday ? (
            <>
              <CheckCircle size={14} color="#10B981" style={styles.statusIcon} />
              <Text style={[styles.statusText, styles.verifiedText]}>Verificado</Text>
            </>
          ) : (
            <>
              <AlertCircle size={14} color="#F59E0B" style={styles.statusIcon} />
              <Text style={[styles.statusText, styles.pendingText]}>Pendiente</Text>
            </>
          )}
        </View>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
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
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  sku: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
  },
  pendingBadge: {
    backgroundColor: '#FFFBEB',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  verifiedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
});

export default InventoryListItem;