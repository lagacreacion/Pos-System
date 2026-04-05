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
import { Product } from '@/types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const colPath = getUserCollection('products');
    const querySnapshot = await getDocs(collection(db, colPath));
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  },

  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const colPath = getUserCollection('products');
    const docRef = await addDoc(collection(db, colPath), {
      ...product,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    const colPath = getUserCollection('products');
    const docRef = doc(db, colPath, id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const colPath = getUserCollection('products');
    const docRef = doc(db, colPath, id);
    await deleteDoc(docRef);
  },

  async decrementStock(id: string, quantity: number): Promise<void> {
    const colPath = getUserCollection('products');
    const docRef = doc(db, colPath, id);
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
};
