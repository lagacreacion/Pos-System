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
import { db } from '@/lib/firebase';
import { Debt } from '@/types';

const COLLECTION = 'debts';

export const debtService = {
  async getAll(): Promise<Debt[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION), orderBy('dueDate', 'asc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async getByCustomer(customerId: string): Promise<Debt[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where('customerId', '==', customerId),
        orderBy('dueDate', 'asc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async getPending(): Promise<Debt[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where('status', '==', 'pending'),
        orderBy('dueDate', 'asc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...debt,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async markAsPaid(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      status: 'paid',
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },
};
