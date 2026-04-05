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
import { Promotion } from '@/types';

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    const colPath = getUserCollection('promotions');
    const querySnapshot = await getDocs(collection(db, colPath));
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Promotion[];
  },

  async getById(id: string): Promise<Promotion | null> {
    const colPath = getUserCollection('promotions');
    const docRef = doc(db, colPath, id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || new Date(),
    } as Promotion;
  },

  async create(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promise<string> {
    const colPath = getUserCollection('promotions');
    const docRef = await addDoc(collection(db, colPath), {
      ...promotion,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Promotion>): Promise<void> {
    const colPath = getUserCollection('promotions');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const colPath = getUserCollection('promotions');
    const docRef = doc(db, colPath, id);
    await deleteDoc(docRef);
  },
};
