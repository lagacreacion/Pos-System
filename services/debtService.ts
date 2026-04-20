import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Debt } from '@/types';

export const debtService = {
  async getAll(): Promise<Debt[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const querySnapshot = await getDocs(
      query(
        collection(db, 'debts'),
        where('userId', '==', user.uid),
        orderBy('dueDate', 'asc')
      )
    );
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

    const querySnapshot = await getDocs(
      query(
        collection(db, 'debts'),
        where('userId', '==', user.uid),
        where('customerId', '==', customerId),
        orderBy('dueDate', 'asc')
      )
    );
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

    const querySnapshot = await getDocs(
      query(
        collection(db, 'debts'),
        where('userId', '==', user.uid),
        where('status', '==', 'pending'),
        orderBy('dueDate', 'asc')
      )
    );
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
    return docRef.id;
  },

  async markAsPaid(id: string): Promise<void> {
    const docRef = doc(db, 'debts', id);
    await updateDoc(docRef, {
      status: 'paid',
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'debts', id);
    await deleteDoc(docRef);
  },

  async deleteBySaleId(saleId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const snap = await getDocs(
      query(
        collection(db, 'debts'),
        where('userId', '==', user.uid),
        where('saleId', '==', saleId)
      )
    );
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'debts', d.id));
    }
  },
};
