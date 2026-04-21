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
import { Product } from '@/types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const q = query(collection(db, 'products'), where('userId', '==', user.uid));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  },

  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  },

  async decrementStock(id: string, quantity: number): Promise<void> {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error('Producto no encontrado');
    }

    const currentStock = snap.data()?.stock || 0;

    if (currentStock - quantity < 0) {
      throw new Error('Stock insuficiente');
    }

    await updateDoc(docRef, {
      stock: currentStock - quantity,
    });
  },

  async incrementStock(id: string, quantity: number): Promise<void> {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const currentStock = snap.data()?.stock || 0;
    await updateDoc(docRef, {
      stock: currentStock + quantity,
    });
  },
};
