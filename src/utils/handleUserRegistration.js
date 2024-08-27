// src/utils/handleUserRegistration.js

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 

/**
 * @param {Object} userData -
 * @param {string} roleId 
 * @returns {Promise<void>}
 */
export const handleUserRegistration = async (userData, roleId) => {
  try {
    // Asegúrate de que userData tenga un campo id
    if (!userData.id) {
      throw new Error('El ID del usuario es necesario.');
    }

    // Registra el usuario en la colección 'usuarios'
    await setDoc(doc(db, 'usuarios', userData.id), {
      ...userData,
      rol_id: roleId
    });

    console.log('Usuario registrado exitosamente');
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    throw error;
  }
};
