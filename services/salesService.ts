import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Sale } from '@/types';
import { productService } from './productService';
import { customerService } from './customerService';
import { promotionService } from './promotionService';
import { debtService } from './debtService';

export const salesService = {
  async getAll(): Promise<Sale[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const querySnapshot = await getDocs(
      query(
        collection(db, 'sales'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      )
    );
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async getByCustomer(customerId: string): Promise<Sale[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const querySnapshot = await getDocs(
      query(
        collection(db, 'sales'),
        where('userId', '==', user.uid),
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
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const querySnapshot = await getDocs(
      query(
        collection(db, 'sales'),
        where('userId', '==', user.uid),
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

    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      userId: user.uid,
      date: serverTimestamp(),
    });
    return docRef.id;
  },

  async remove(sale: Sale): Promise<void> {
    // Restore stock
    for (const item of sale.items) {
      if (item.type === 'product' && item.productId) {
        await productService.incrementStock(item.productId, item.quantity);
      }
      if (item.type === 'promotion' && item.promotionId) {
        const promotion = await promotionService.getById(item.promotionId);
        if (promotion && promotion.products) {
          for (const promoProduct of promotion.products) {
            await productService.incrementStock(
              promoProduct.productId,
              promoProduct.quantity * item.quantity
            );
          }
        }
      }
    }

    // Reverse customer totalSpent
    if (sale.customerId) {
      await customerService.updateSpent(sale.customerId, -sale.totalAmount);
    }

    // Remove debt if credit
    if (sale.paymentMethod === 'credit') {
      await debtService.deleteBySaleId(sale.id);
    }

    await deleteDoc(doc(db, 'sales', sale.id));
  },
};
