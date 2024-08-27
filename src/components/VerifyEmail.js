import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'; // Asegúrate de tener la configuración correcta

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer el código de verificación (oobCode) de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oobCode = urlParams.get('oobCode');

    if (oobCode) {
      verifyEmail(oobCode);
    } else {
      setMessage('No se pudo encontrar el código de verificación.');
    }
  }, [location]);

  // Verificar el correo electrónico usando el código de verificación
  const verifyEmail = async (oobCode) => {
    try {
      await auth.applyActionCode(oobCode);
      setMessage('Correo electrónico verificado exitosamente.');
      // Redirigir o realizar otra acción después de la verificación
      setTimeout(() => navigate('/login'), 3000); // Redirige a la página de inicio de sesión después de 3 segundos
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      setMessage('Hubo un problema al verificar tu correo electrónico.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Verificación de Correo Electrónico</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
