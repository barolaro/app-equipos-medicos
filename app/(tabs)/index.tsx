import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Package, Tag, ArrowRight } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import StatsCard from '@/components/StatsCard';
import LowStockItems from '@/components/LowStockItems';
import RecentActivity from '@/components/RecentActivity';
import { getMockStats } from '@/utils/mockData';

export default function HomeScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setStats(getMockStats());
      }, 500);
    };

    loadData();
  }, []);

  const handleViewPending = () => {
    router.push({
      pathname: '/inventory',
      params: { filter: 'pendientes' }
    });
  };

  if (!stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando panel de control...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/felix-bulnes-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            Sistema de Verificación de Equipos Clínicos
          </Text>
          <Text style={styles.headerSubtitle}>
            Hospital Clínico Félix Bulnes
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatsCard 
            title="Total Equipos" 
            value={stats.totalItems.toString()}
            icon={<Package size={24} color="#235A8A" />}
            backgroundColor="#FFFFFF"
            iconColor="#EFF6FF"
          />
          <StatsCard 
            title="Categorías" 
            value={stats.categories.toString()}
            icon={<Tag size={24} color="#235A8A" />}
            backgroundColor="#FFFFFF"
            iconColor="#EFF6FF"
          />
        </View>
        <View style={styles.statsRow}>
          <StatsCard 
            title="Verificados Hoy" 
            value={stats.verifiedToday.toString()}
            icon={<CheckCircle size={24} color="#10B981" />}
            backgroundColor="#FFFFFF"
            iconColor="#ECFDF5"
          />
          <StatsCard 
            title="Pendientes" 
            value={stats.pendingVerification.toString()} 
            icon={<AlertCircle size={24} color="#BB6E38" />}
            backgroundColor="#FFFFFF"
            iconColor="#FFF7ED"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Equipos Pendientes</Text>
          <TouchableOpacity style={styles.seeAllButton} onPress={handleViewPending}>
            <Text style={styles.seeAllText}>Ver todos</Text>
            <ArrowRight size={16} color="#235A8A" />
          </TouchableOpacity>
        </View>
        <LowStockItems />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todo</Text>
            <ArrowRight size={16} color="#235A8A" />
          </TouchableOpacity>
        </View>
        <RecentActivity />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    marginBottom: 24,
    backgroundColor: '#235A8A',
    margin: -16,
    padding: 24,
    paddingTop: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 240,
    height: 80,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
  },
  statsGrid: {
    marginTop: -32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#235A8A',
    marginRight: 4,
  },
});