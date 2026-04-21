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
import { Promotion } from '@/types';

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const q = query(collection(db, 'promotions'), where('userId', '==', user.uid));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Promotion[];
  },

  async getById(id: string): Promise<Promotion | null> {
    const docRef = doc(db, 'promotions', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || new Date(),
    } as Promotion;
  },

  async create(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, 'promotions'), {
      ...promotion,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Promotion>): Promise<void> {
    const docRef = doc(db, 'promotions', id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'promotions', id);
    await deleteDoc(docRef);
  },
};
