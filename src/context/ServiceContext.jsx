import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import db from '../services/db';
import { AuthContext } from './AuthContext';

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), where('clientId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionalServices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), where('professionalId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching professional services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching all services:', error);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (serviceData) => {
    try {
      await addDoc(collection(db, 'services'), serviceData);
      fetchServices(); // Refresh
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const updateService = async (id, updateData) => {
    try {
      await updateDoc(doc(db, 'services', id), updateData);
      fetchServices(); // Refresh
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

useEffect(() => {
  fetchServices();
}, );

  return (
    <ServiceContext.Provider value={{
      services,
      loading,
      fetchServices,
      fetchProfessionalServices,
      fetchAllServices,
      addService,
      updateService
    }}>
      {children}
    </ServiceContext.Provider>
  );
};
