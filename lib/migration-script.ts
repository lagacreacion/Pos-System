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

export async function migrateExistingDataToUser(targetUserId: string) {
  console.log(`🚀 Iniciando migración para el usuario: ${targetUserId}`);

  for (const colName of COLLECTIONS_TO_MIGRATE) {
    console.log(`📂 Procesando colección: ${colName}...`);
    
    try {
      const colRef = collection(db, colName);
      
      // Obtenemos todos los documentos de la colección plana
      const snapshot = await getDocs(colRef);
      
      let updatedCount = 0;
      let skippedCount = 0;

      for (const d of snapshot.docs) {
        const data = d.data();
        
        // Solo actualizamos si NO tiene userId
        if (!data.userId) {
          const docRef = doc(db, colName, d.id);
          await updateDoc(docRef, {
            userId: targetUserId
          });
          updatedCount++;
        } else {
          skippedCount++;
        }
      }

      console.log(`✅ ${colName}: ${updatedCount} actualizados, ${skippedCount} ya tenían userId.`);
    } catch (error) {
      console.error(`❌ Error en colección ${colName}:`, error);
    }
  }

  console.log('🏁 Migración finalizada.');
}

// Para usar este script, se puede llamar desde una consola de desarrollador
// o una página temporal pasando el auth.currentUser.uid
