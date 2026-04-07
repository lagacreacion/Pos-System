export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  cost?: number;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalDebt: number;
  totalSpent: number;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  products: { productId: string; quantity: number }[];
  finalPrice: number;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'promotion';
  productId?: string;
  promotionId?: string;
}

export interface Sale {
  id: string;
  customerId?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'transfer' | 'credit';
  date: Date;
  debtId?: string;
}

export interface Debt {
  id: string;
  customerId: string;
  saleId: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid';
  createdAt: Date;
}

export interface DailyReport {
  date: Date;
  totalSold: number;
  totalCollected: number;
  totalPending: number;
  customersServed: number;
  sales: Sale[];
}

export interface MonthlyReport {
  month: string;
  totalSold: number;
  totalCollected: number;
  totalPending: number;
}

export interface Analytics {
  topProducts: { name: string; quantity: number }[];
  bottomProducts: { name: string; quantity: number }[];
  topCustomers: { name: string; totalSpent: number }[];
  totalRevenue: number;
}
