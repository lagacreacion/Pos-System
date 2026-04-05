import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, getUserCollection } from '@/lib/firebase';
import { Sale } from '@/types';
import { productService } from './productService';
import { customerService } from './customerService';
import { promotionService } from './promotionService';

export const salesService = {
  async getAll(): Promise<Sale[]> {
    const colPath = getUserCollection('sales');
    const querySnapshot = await getDocs(
      query(collection(db, colPath), orderBy('date', 'desc'))
    );
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async getByCustomer(customerId: string): Promise<Sale[]> {
    const colPath = getUserCollection('sales');
    const querySnapshot = await getDocs(
      query(
        collection(db, colPath),
        where('customerId', '==', customerId),
        orderBy('date', 'desc')
      )
    );
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const colPath = getUserCollection('sales');
    const querySnapshot = await getDocs(
      query(
        collection(db, colPath),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      )
    );
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async create(sale: Omit<Sale, 'id'>): Promise<string> {
    // Decrement stock for each item
    for (const item of sale.items) {
      if (item.type === 'product' && item.productId) {
        await productService.decrementStock(item.productId, item.quantity);
      }
      // PASO 5 FIX: If the item is a promotion, fetch its products and decrement each one
      if (item.type === 'promotion' && item.promotionId) {
        const promotion = await promotionService.getById(item.promotionId);
        if (promotion && promotion.products) {
          for (const promoProduct of promotion.products) {
            await productService.decrementStock(
              promoProduct.productId,
              promoProduct.quantity * item.quantity
            );
          }
        }
      }
    }

    // Update customer total spent
    if (sale.customerId) {
      await customerService.updateSpent(sale.customerId, sale.totalAmount);
    }

    const colPath = getUserCollection('sales');
    const docRef = await addDoc(collection(db, colPath), {
      ...sale,
      date: new Date(),
    });
    return docRef.id;
  },
};
