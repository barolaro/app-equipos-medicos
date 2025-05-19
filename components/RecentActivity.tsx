import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Calendar } from 'lucide-react-native';

type ActivityItem = {
  id: string;
  type: 'verify' | 'pending';
  itemName: string;
  date: Date;
  location?: string;
  user?: string;
};

// Datos de ejemplo para actividades recientes
const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'verify',
    itemName: 'Monitor de Signos Vitales',
    date: new Date(2025, 0, 15, 14, 30),
    location: 'UCI Adultos',
    user: 'Dr. Juan Pérez',
  },
  {
    id: '2',
    type: 'pending',
    itemName: 'Desfibrilador Automático',
    date: new Date(2025, 0, 15, 12, 15),
    location: 'Urgencias',
    user: 'Dra. María González',
  },
  {
    id: '3',
    type: 'verify',
    itemName: 'Bomba de Infusión',
    date: new Date(2025, 0, 15, 10, 45),
    location: 'Pediatría',
    user: 'Dr. Carlos Ruiz',
  },
  {
    id: '4',
    type: 'verify',
    itemName: 'Electrocardiógrafo',
    date: new Date(2025, 0, 15, 9, 20),
    location: 'Cardiología',
    user: 'Dra. Ana Silva',
  },
];

const RecentActivity = () => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };

  const renderActivity = ({ item }: { item: ActivityItem }) => {
    const isVerified = item.type === 'verify';
    
    return (
      <View style={styles.activityItem}>
        <View style={[
          styles.iconContainer,
          isVerified ? styles.verifiedIcon : styles.pendingIcon
        ]}>
          {isVerified ? (
            <CheckCircle size={16} color="#10B981" />
          ) : (
            <AlertCircle size={16} color="#BB6E38" />
          )}
        </View>
        
        <View style={styles.activityDetails}>
          <Text style={styles.activityDescription}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            {isVerified ? ' verificado' : ' pendiente de verificación'}
          </Text>
          
          <View style={styles.activityMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{item.user}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{formatTime(item.date)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={recentActivities}
      renderItem={renderActivity}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verifiedIcon: {
    backgroundColor: '#ECFDF5',
  },
  pendingIcon: {
    backgroundColor: '#FFF7ED',
  },
  activityDetails: {
    flex: 1,
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 4,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    color: '#235A8A',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },
});

export default RecentActivity;