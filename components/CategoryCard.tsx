import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '@/types';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

type CategoryCardProps = {
  category: Category;
  verifiedCount: number;
  pendingCount: number;
  onPress: () => void;
};

const CategoryCard = ({ category, verifiedCount, pendingCount, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.header, { backgroundColor: '#235A8A' }]}>
        <Text style={styles.name}>{category.name}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle size={16} color="#10B981" />
          </View>
          <View>
            <Text style={styles.statValue}>{verifiedCount}</Text>
            <Text style={styles.statLabel}>Verificados</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
            <AlertCircle size={16} color="#BB6E38" />
          </View>
          <View>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#235A8A',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
});

export default CategoryCard;