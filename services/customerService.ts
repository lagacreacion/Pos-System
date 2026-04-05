import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db, getUserCollection } from '@/lib/firebase';
import { Customer } from '@/types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const colPath = getUserCollection('customers');
    const querySnapshot = await getDocs(collection(db, colPath));
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Customer[];
  },

  async getById(id: string): Promise<Customer | null> {
    const colPath = getUserCollection('customers');
    const docRef = doc(db, colPath, id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || new Date(),
    } as Customer;
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt' | 'totalSpent'>): Promise<string> {
    const colPath = getUserCollection('customers');
    const docRef = await addDoc(collection(db, colPath), {
      ...customer,
      totalDebt: 0,
      totalSpent: 0,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Customer>): Promise<void> {
    const colPath = getUserCollection('customers');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const colPath = getUserCollection('customers');
    const docRef = doc(db, colPath, id);
    await deleteDoc(docRef);
  },

  async updateSpent(id: string, amount: number): Promise<void> {
    const customer = await this.getById(id);
    if (!customer) return;

    const colPath = getUserCollection('customers');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, {
      totalSpent: (customer.totalSpent || 0) + amount,
    });
  },

  async updateDebt(id: string, amount: number): Promise<void> {
    const colPath = getUserCollection('customers');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, {
      totalDebt: amount,
    });
  },
};
