import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

type StatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  backgroundColor: string;
  iconColor: string;
};

const StatsCard = ({ title, value, icon, backgroundColor, iconColor }: StatsCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#235A8A',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
});

export default StatsCard;