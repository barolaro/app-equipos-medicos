export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'verificador';
  created_by?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  quantity: number;
  price: number;
  cost?: number;
  location?: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  minimumStock?: number;
  lastVerification?: Date;
  isVerifiedToday: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  itemCount: number;
};

export type ScanResult = {
  type: string;
  data: string;
};

export type SortOption = 'name' | 'category' | 'quantity' | 'price' | 'updatedAt';

export type FilterOptions = {
  query: string;
  category: string | null;
  lowStock: boolean;
};

export type DashboardStats = {
  totalItems: number;
  verifiedToday: number;
  pendingVerification: number;
  categories: number;
};

export type VerificationRecord = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  barcode: string;
  category: string;
  verificationDate: Date;
  verifiedBy: string;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};