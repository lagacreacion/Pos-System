import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer } from '@/types';

const COLLECTION = 'customers';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Customer[];
  },

  async getById(id: string): Promise<Customer | null> {
    const querySnapshot = await getDocs(query(collection(db, COLLECTION), where('__name__', '==', id)));
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Customer;
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt' | 'totalSpent'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...customer,
      totalDebt: 0,
      totalSpent: 0,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Customer>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  async updateSpent(id: string, amount: number): Promise<void> {
    const customer = await this.getById(id);
    if (!customer) return;

    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      totalSpent: (customer.totalSpent || 0) + amount,
    });
  },

  async updateDebt(id: string, amount: number): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      totalDebt: amount,
    });
  },
};
