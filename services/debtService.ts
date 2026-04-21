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
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Debt, Payment } from '@/types';
import { customerService } from './customerService';

export const debtService = {
  async getAll(): Promise<Debt[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const q = query(collection(db, 'debts'), where('userId', '==', user.uid), orderBy('dueDate', 'asc'));

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

    const q = query(collection(db, 'debts'), where('userId', '==', user.uid), where('customerId', '==', customerId), orderBy('dueDate', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      dueDate: d.data().dueDate?.toDate() || new Date(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Debt[];
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt' | 'paidAmount' | 'status'>, initialPayment: number = 0): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const status = initialPayment >= debt.amount ? 'paid' : initialPayment > 0 ? 'partial' : 'pending';

    const docRef = await addDoc(collection(db, 'debts'), {
      ...debt,
      paidAmount: initialPayment,
      status,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    // Record initial payment if exists
    if (initialPayment > 0) {
      await addDoc(collection(db, 'payments'), {
        debtId: docRef.id,
        amount: initialPayment,
        date: serverTimestamp(),
        userId: user.uid,
        note: 'Pago inicial',
      });
    }

    if (debt.customerId) {
      const remainingToAdd = debt.amount - initialPayment;
      if (remainingToAdd > 0) {
        await customerService.updateDebt(debt.customerId, remainingToAdd);
      }
    }

    return docRef.id;
  },

  async addPayment(debtId: string, amount: number, note?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const debtRef = doc(db, 'debts', debtId);
    const debtSnap = await getDoc(debtRef);

    if (!debtSnap.exists()) throw new Error("Deuda no encontrada");
    const debtData = debtSnap.data() as Debt;

    const remaining = debtData.amount - (debtData.paidAmount || 0);
    // Overpayment protection: don't allow paying more than remaining
    const actualAmount = Math.min(amount, remaining);
    
    if (actualAmount <= 0) return;

    const newPaidAmount = (debtData.paidAmount || 0) + actualAmount;
    const newStatus = newPaidAmount >= debtData.amount ? 'paid' : 'partial';

    const batch = writeBatch(db);

    // Update Debt
    batch.update(debtRef, {
      paidAmount: newPaidAmount,
      status: newStatus,
    });

    // Record Payment
    const paymentRef = doc(collection(db, 'payments'));
    batch.set(paymentRef, {
      debtId,
      amount: actualAmount,
      date: serverTimestamp(),
      userId: user.uid,
      note: note || (amount > remaining ? `Abono ajustado (exceso de ${amount - remaining})` : 'Abono realizado'),
    });

    await batch.commit();

    // Update Customer
    if (debtData.customerId) {
      await customerService.updateDebt(debtData.customerId, -actualAmount);
    }
  },

  async getPayments(debtId: string): Promise<Payment[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    // Removed orderBy('date', 'desc') to avoid composite index requirement
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', user.uid),
      where('debtId', '==', debtId)
    );

    const querySnapshot = await getDocs(q);
    const payments = querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate() || new Date(),
    })) as Payment[];

    // Sort in memory instead
    return payments.sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async markAsPaid(id: string): Promise<void> {
    const debtRef = doc(db, 'debts', id);
    const snap = await getDoc(debtRef);
    if (!snap.exists()) return;

    const data = snap.data() as Debt;
    const remaining = data.amount - (data.paidAmount || 0);

    if (remaining > 0) {
      await this.addPayment(id, remaining, 'Liquidación total');
    } else {
      // If already paid but status not updated (edge case)
      await updateDoc(debtRef, { status: 'paid' });
    }
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'debts', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Debt;
      const remaining = data.amount - (data.paidAmount || 0);
      if (data.status !== 'paid' && data.customerId && remaining > 0) {
        await customerService.updateDebt(data.customerId, -remaining);
      }
    }
    await deleteDoc(docRef);
  },

  async deleteBySaleId(saleId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const q = query(collection(db, 'debts'), where('userId', '==', user.uid), where('saleId', '==', saleId));

    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await this.delete(d.id);
    }
  },
};
