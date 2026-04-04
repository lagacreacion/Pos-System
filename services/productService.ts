import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

const COLLECTION = 'products';

export const productService = {
  async getAll(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  },

  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...product,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { ...updates });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  async decrementStock(id: string, quantity: number): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    const product = await getDocs(query(collection(db, COLLECTION), where('__name__', '==', id)));
    const currentStock = product.docs[0]?.data()?.stock || 0;

    if (currentStock - quantity < 0) {
      throw new Error('Stock insuficiente');
    }

    await updateDoc(docRef, {
      stock: currentStock - quantity,
    });
  },
};
