import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        setUser(firebaseUser);
        setRole(docSnap.exists() ? docSnap.data().role : null);
      } else {
        setUser(null);
        setRole(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "users", res.user.uid);
    const docSnap = await getDoc(docRef);
    const userRole = docSnap.exists() ? docSnap.data().role : "pessoal";
    setRole(userRole);
    return res;
  };

 const register = async (email, password, userRole = "pessoal", extraData = {}) => 
  { 
   const res = await createUserWithEmailAndPassword(auth, email, password); 
    await setDoc(doc(db, "users", res.user.uid), {
     email,
      role: userRole, 
      ...extraData 
    }); 
    setRole(userRole); 
    return res;
  };

  const loginWithGoogle = async (userRole = "pessoal") => { 
    const provider = new GoogleAuthProvider(); 
    const res = await signInWithPopup(auth, provider); 
    const ref = doc(db, "users", res.user.uid); 
    const snap = await getDoc(ref); 
    
    if (!snap.exists()) { 
      await setDoc(ref, { 
        email: res.user.email, 
        role: userRole 
      }); 
    } 
    
    const finalSnap = await getDoc(ref); 
    setRole(finalSnap.data().role); 
    setUser(res.user); 
    return res; 
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      logout,
      authLoading
    }}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};
