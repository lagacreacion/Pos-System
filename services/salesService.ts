import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Sale } from '@/types';

const COLLECTION = 'sales';

export const salesService = {
  async getAll(): Promise<Sale[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION), orderBy('date', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async getByCustomer(customerId: string): Promise<Sale[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where('customerId', '==', customerId),
        orderBy('date', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Sale[];
  },

  async create(sale: Omit<Sale, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...sale,
      date: new Date(),
    });
    return docRef.id;
  },
};
