import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Customer } from '@/types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const isAdmin = user.email === 'lagaalfonso1@gmail.com';
    const q = isAdmin
      ? query(collection(db, 'customers'))
      : query(collection(db, 'customers'), where('userId', '==', user.uid));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Customer[];
  },

  async getById(id: string): Promise<Customer | null> {
    const docRef = doc(db, 'customers', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || new Date(),
    } as Customer;
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt' | 'totalSpent'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, 'customers'), {
      ...customer,
      userId: user.uid,
      totalDebt: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Customer>): Promise<void> {
    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'customers', id);
    await deleteDoc(docRef);
  },

  async updateSpent(id: string, amount: number): Promise<void> {
    const customer = await this.getById(id);
    if (!customer) return;

    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, {
      totalSpent: (customer.totalSpent || 0) + amount,
    });
  },

  async updateDebt(id: string, amount: number): Promise<void> {
    const customer = await this.getById(id);
    if (!customer) return;

    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, {
      totalDebt: (customer.totalDebt || 0) + amount,
    });
  },
};
