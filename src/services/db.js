import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const createService = async (service) => {
  await addDoc(collection(db, 'services'), service);
};

export const getServices = async () => {
  const snapshot = await getDocs(collection(db, 'services'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateServiceStatus = async (id, status) => {
  const ref = doc(db, 'services', id);
  await updateDoc(ref, { status });
};

export default db; // ✅ exporta o db para uso direto

