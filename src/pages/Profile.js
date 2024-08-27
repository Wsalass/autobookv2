import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); 
      setError(null); 
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate('/login');
          return;
        }

        const userDoc = doc(db, 'usuarios', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData({
            nombre: data.nombre || 'Nombre no proporcionado',
            email: data.email || 'Email no proporcionado',
          });
          const roleName = await getRoleName(data.rol_id);
          setRoleName(roleName);
        } else {
          setError('No se encontró la información del usuario.');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error.message);
        setError('Hubo un error al cargar los datos del perfil.');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUserData();
  }, [navigate]);

  const getRoleName = async (roleId) => {
    try {
      const roleDoc = doc(db, 'roles', roleId.toString()); 
      const roleSnapshot = await getDoc(roleDoc);
      return roleSnapshot.exists() ? roleSnapshot.data().nombre || 'Rol desconocido' : 'Rol desconocido';
    } catch (error) {
      console.error('Error al obtener el nombre del rol:', error.message);
      return 'Error al obtener rol';
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-900 dark:text-white">Cargando...</p>; 
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Perfil de Usuario
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          {userData && (
            <div className="space-y-4 md:space-y-6">
              {/* Campos de datos del usuario */}
              {['nombre', 'email'].map((key) => (
                <div key={key}>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                  </label>
                  <p className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {userData[key] || `${key.charAt(0).toUpperCase() + key.slice(1)} no proporcionado`}
                  </p>
                </div>
              ))}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Rol
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {roleName || 'Rol no proporcionado'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
