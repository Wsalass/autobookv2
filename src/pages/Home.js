import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userDoc = doc(db, 'usuarios', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userRoleId = userSnapshot.data().rol_id;
            const roleDoc = doc(db, 'roles', userRoleId.toString());
            const roleSnapshot = await getDoc(roleDoc);

            if (roleSnapshot.exists()) {
              setUserRole(roleSnapshot.data().nombre);
            } else {
              console.error('El rol del usuario no existe');
              setUserRole(null);
            }
          } else {
            console.error('El documento del usuario no existe');
            setUserRole(null); 
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error.message);
          setUserRole(null); 
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }, (error) => {
      console.error('Error al verificar el estado de autenticación:', error);
      setIsLoggedIn(false);
      setUserRole(null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} roles={userRole} />
      <div className="min-h-screen py-8 px-4 mx-auto max-w-screen-lg text-center sm:py-12 sm:px-6 lg:py-16 lg:px-8 relative">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          ¡Bienvenidos a Autobooks!
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-700 sm:text-xl sm:px-10 lg:px-24 xl:px-36 dark:text-gray-400">
          Nos llena de entusiasmo darte la bienvenida. Nos alegra enormemente que hayas decidido unirte a nosotros. Te invitamos a explorar nuestra cuidada selección de libros, diseñada para ofrecerte una experiencia única y enriquecedora. Disfruta de la inmersión en mundos fascinantes, descubre nuevas perspectivas y permite que cada página te lleve a un viaje inolvidable. Tu experiencia aquí es nuestra prioridad, así que si necesitas alguna recomendación o asistencia, no dudes en contactarnos. ¡Esperamos que encuentres en nuestra colección algo que te inspire y te apasione!
        </p>
        <div className="flex justify-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/catalog')}
              type="button"
              className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-600 hover:bg-gray-200 hover:text-yellow-400 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
            >
              Ir al Catálogo
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                type="button"
                className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-600 hover:bg-gray-200 hover:text-yellow-400 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                type="button"
                className="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-600 hover:bg-gray-200 hover:text-yellow-400 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
              >
                Regístrate
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
