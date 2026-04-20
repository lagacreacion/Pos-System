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
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Debt } from '@/types';
import { customerService } from './customerService';

export const debtService = {
  async getAll(): Promise<Debt[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const isAdmin = user.email === 'lagaalfonso1@gmail.com';
    const q = isAdmin
      ? query(collection(db, 'debts'), orderBy('dueDate', 'asc'))
      : query(collection(db, 'debts'), where('userId', '==', user.uid), orderBy('dueDate', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      dueDate: d.data().dueDate?.toDate() || new Date(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async getByCustomer(customerId: string): Promise<Debt[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const isAdmin = user.email === 'lagaalfonso1@gmail.com';
    const q = isAdmin
      ? query(collection(db, 'debts'), where('customerId', '==', customerId), orderBy('dueDate', 'asc'))
      : query(collection(db, 'debts'), where('userId', '==', user.uid), where('customerId', '==', customerId), orderBy('dueDate', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      dueDate: d.data().dueDate?.toDate() || new Date(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async getPending(): Promise<Debt[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const isAdmin = user.email === 'lagaalfonso1@gmail.com';
    const q = isAdmin
      ? query(collection(db, 'debts'), where('status', '==', 'pending'), orderBy('dueDate', 'asc'))
      : query(collection(db, 'debts'), where('userId', '==', user.uid), where('status', '==', 'pending'), orderBy('dueDate', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      dueDate: d.data().dueDate?.toDate() || new Date(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, 'debts'), {
      ...debt,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    if (debt.customerId) {
      await customerService.updateDebt(debt.customerId, debt.amount);
    }

    return docRef.id;
  },

  async markAsPaid(id: string): Promise<void> {
    const docRef = doc(db, 'debts', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;

    const data = snap.data();
    if (data.status !== 'paid') {
      await updateDoc(docRef, {
        status: 'paid',
      });
      if (data.customerId) {
        await customerService.updateDebt(data.customerId, -data.amount);
      }
    }
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'debts', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'pending' && data.customerId) {
        await customerService.updateDebt(data.customerId, -data.amount);
      }
    }
    await deleteDoc(docRef);
  },

  async deleteBySaleId(saleId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const isAdmin = user.email === 'lagaalfonso1@gmail.com';
    const q = isAdmin
      ? query(collection(db, 'debts'), where('saleId', '==', saleId))
      : query(collection(db, 'debts'), where('userId', '==', user.uid), where('saleId', '==', saleId));

    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const data = d.data();
      if (data.status === 'pending' && data.customerId) {
        await customerService.updateDebt(data.customerId, -data.amount);
      }
      await deleteDoc(doc(db, 'debts', d.id));
    }
  },
};
