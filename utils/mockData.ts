import { InventoryItem, Category, VerificationRecord } from '@/types';

// Función para determinar si un equipo está verificado hoy
const isVerifiedToday = (lastVerification: Date | undefined): boolean => {
  if (!lastVerification) return false;
  const today = new Date();
  return (
    lastVerification.getDate() === today.getDate() &&
    lastVerification.getMonth() === today.getMonth() &&
    lastVerification.getFullYear() === today.getFullYear()
  );
};

// Datos de ejemplo para equipos médicos
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Monitor de Signos Vitales',
    sku: 'MSV-2024-001',
    barcode: '123456789012',
    category: 'Monitoreo',
    quantity: 8,
    price: 12500.00,
    cost: 10000.00,
    location: 'Almacén A, Estante 3',
    description: 'Monitor multiparamétrico con pantalla táctil de 12" para signos vitales.',
    image: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=500',
    createdAt: new Date(2024, 9, 1),
    updatedAt: new Date(2024, 9, 15),
    lastVerification: new Date(),
    isVerifiedToday: true,
  },
  {
    id: '2',
    name: 'Desfibrilador Automático',
    sku: 'DEA-2024-002',
    barcode: '234567890123',
    category: 'Emergencia',
    quantity: 4,
    price: 15000.00,
    cost: 12000.00,
    location: 'Almacén A, Estante 4',
    description: 'Desfibrilador externo automático con pantalla LCD y electrodos adulto/pediátrico.',
    image: 'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=500',
    createdAt: new Date(2024, 9, 2),
    updatedAt: new Date(2024, 9, 14),
    lastVerification: new Date(),
    isVerifiedToday: true,
  },
  {
    id: '3',
    name: 'Bomba de Infusión',
    sku: 'BIN-2024-003',
    barcode: '345678901234',
    category: 'Terapia',
    quantity: 12,
    price: 3500.00,
    cost: 2800.00,
    location: 'Almacén B, Estante 1',
    description: 'Bomba de infusión volumétrica con batería recargable y alarmas programables.',
    image: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=500',
    createdAt: new Date(2024, 9, 3),
    updatedAt: new Date(2024, 9, 13),
    lastVerification: null,
    isVerifiedToday: false,
  },
  {
    id: '4',
    name: 'Ventilador Mecánico',
    sku: 'VEN-2024-004',
    barcode: '456789012345',
    category: 'Respiratorio',
    quantity: 3,
    price: 25000.00,
    cost: 20000.00,
    location: 'Almacén A, Estante 1',
    description: 'Ventilador mecánico para cuidados intensivos con modos invasivos y no invasivos.',
    image: 'https://images.pexels.com/photos/4226883/pexels-photo-4226883.jpeg?auto=compress&cs=tinysrgb&w=500',
    createdAt: new Date(2024, 9, 4),
    updatedAt: new Date(2024, 9, 12),
    lastVerification: null,
    isVerifiedToday: false,
  },
  {
    id: '5',
    name: 'Electrocardiógrafo',
    sku: 'ECG-2024-005',
    barcode: '567890123456',
    category: 'Diagnóstico',
    quantity: 6,
    price: 8000.00,
    cost: 6500.00,
    location: 'Almacén B, Estante 2',
    description: 'ECG de 12 canales con interpretación automática y pantalla táctil.',
    image: 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=500',
    createdAt: new Date(2024, 9, 5),
    updatedAt: new Date(2024, 9, 11),
    lastVerification: null,
    isVerifiedToday: false,
  }
];

// Categorías de equipos médicos
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Monitoreo',
    color: '#3B82F6',
    itemCount: 15,
  },
  {
    id: '2',
    name: 'Emergencia',
    color: '#EF4444',
    itemCount: 8,
  },
  {
    id: '3',
    name: 'Terapia',
    color: '#10B981',
    itemCount: 20,
  },
  {
    id: '4',
    name: 'Respiratorio',
    color: '#8B5CF6',
    itemCount: 10,
  },
  {
    id: '5',
    name: 'Diagnóstico',
    color: '#F59E0B',
    itemCount: 12,
  },
  {
    id: '6',
    name: 'Cirugía',
    color: '#EC4899',
    itemCount: 18,
  },
  {
    id: '7',
    name: 'Laboratorio',
    color: '#6366F1',
    itemCount: 25,
  },
  {
    id: '8',
    name: 'Rehabilitación',
    color: '#14B8A6',
    itemCount: 15,
  }
];

// Mock stats para el dashboard
export const getMockStats = (): DashboardStats => {
  const verifiedToday = mockInventoryItems.filter(item => item.isVerifiedToday).length;
  return {
    totalItems: mockInventoryItems.length,
    verifiedToday,
    pendingVerification: mockInventoryItems.length - verifiedToday,
    categories: mockCategories.length,
  };
};

// Historial de verificaciones
export const mockVerificationHistory: VerificationRecord[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'Monitor de Signos Vitales',
    barcode: '123456789012',
    category: 'Monitoreo',
    verificationDate: new Date(2024, 0, 15, 14, 30),
    verifiedBy: 'Dr. Juan Pérez',
  },
  {
    id: '2',
    equipmentId: '2',
    equipmentName: 'Desfibrilador Automático',
    barcode: '234567890123',
    category: 'Emergencia',
    verificationDate: new Date(2024, 0, 15, 12, 15),
    verifiedBy: 'Dra. María González',
  },
  {
    id: '3',
    equipmentId: '3',
    equipmentName: 'Bomba de Infusión',
    barcode: '345678901234',
    category: 'Terapia',
    verificationDate: new Date(2024, 0, 15, 10, 45),
    verifiedBy: 'Dr. Carlos Ruiz',
  },
  {
    id: '4',
    equipmentId: '4',
    equipmentName: 'Ventilador Mecánico',
    barcode: '456789012345',
    category: 'Respiratorio',
    verificationDate: new Date(2024, 0, 15, 9, 20),
    verifiedBy: 'Dra. Ana Silva',
  },
  {
    id: '5',
    equipmentId: '5',
    equipmentName: 'Electrocardiógrafo',
    barcode: '567890123456',
    category: 'Diagnóstico',
    verificationDate: new Date(2024, 0, 14, 16, 45),
    verifiedBy: 'Dr. Pedro Martínez',
  },
];