// pages/UpdateInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';

const UpdateInfo = () => {
  const [user, setUser] = useState(null);
  const [idCard, setIdCard] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          const userDoc = doc(db, 'usuarios', currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setIdCard(userData.idCard || '');
            setPhoneNumber(userData.phoneNumber || '');
          } else {
            setError('No se encontró la información del usuario.');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error.message);
        setError('Hubo un problema al cargar tus datos. Inténtalo de nuevo más tarde.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = doc(db, 'usuarios', currentUser.uid);
        await updateDoc(userDoc, {
          idCard: idCard,
          phoneNumber: phoneNumber
        });

        setSuccessMessage('Información actualizada con éxito.');
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error.message);
      setError('Hubo un problema al actualizar la información. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="max-w-screen-xl min-h-screen mx-auto p-6 shadow-2xl rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Actualizar Información Adicional</h1>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {user && (
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div>
              <label htmlFor="idCard" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tarjeta de Identidad</label>
              <input
                type="text"
                id="idCard"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número de Teléfono</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Actualizar Información
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UpdateInfo;
