import { 
  db
} from './firebase';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc
} from 'firebase/firestore';

/**
 * SCRIPT DE MIGRACIÓN (BORRADOR)
 * 
 * OBJETIVO: 
 * Recorrer las colecciones principales y agregar el campo 'userId' 
 * a todos los documentos que aún no lo tengan.
 * 
 * REGLA: No borra datos, solo agrega el campo.
 */

const COLLECTIONS_TO_MIGRATE = [
  'products',
  'sales',
  'customers',
  'debts',
  'promotions'
];

export async function migrateExistingDataToUser(targetUserId: string): Promise<number> {
  let totalUpdated = 0;

  for (const colName of COLLECTIONS_TO_MIGRATE) {
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      
      for (const d of snapshot.docs) {
        const data = d.data();
        if (!data.userId) {
          const docRef = doc(db, colName, d.id);
          await updateDoc(docRef, {
            userId: targetUserId
          });
          totalUpdated++;
        }
      }
    } catch (error) {
      console.error(`Error migrando ${colName}:`, error);
    }
  }

  return totalUpdated;
}

// Para usar este script, se puede llamar desde una consola de desarrollador
// o una página temporal pasando el auth.currentUser.uid
