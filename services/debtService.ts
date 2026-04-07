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
} from 'firebase/firestore';
import { db, getUserCollection } from '@/lib/firebase';
import { Debt } from '@/types';

export const debtService = {
  async getAll(): Promise<Debt[]> {
    const colPath = getUserCollection('debts');
    const querySnapshot = await getDocs(
      query(collection(db, colPath), orderBy('dueDate', 'asc'))
    );
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      dueDate: d.data().dueDate?.toDate() || new Date(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async getByCustomer(customerId: string): Promise<Debt[]> {
    const colPath = getUserCollection('debts');
    const querySnapshot = await getDocs(
      query(
        collection(db, colPath),
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
    const colPath = getUserCollection('debts');
    const querySnapshot = await getDocs(
      query(
        collection(db, colPath),
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
    const colPath = getUserCollection('debts');
    const docRef = await addDoc(collection(db, colPath), {
      ...debt,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async markAsPaid(id: string): Promise<void> {
    const colPath = getUserCollection('debts');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, {
      status: 'paid',
    });
  },

  async delete(id: string): Promise<void> {
    const colPath = getUserCollection('debts');
    const docRef = doc(db, colPath, id);
    await deleteDoc(docRef);
  },

  async deleteBySaleId(saleId: string): Promise<void> {
    const colPath = getUserCollection('debts');
    const snap = await getDocs(
      query(collection(db, colPath), where('saleId', '==', saleId))
    );
    for (const d of snap.docs) {
      await deleteDoc(doc(db, colPath, d.id));
    }
  },
};
