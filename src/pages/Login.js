import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig'; // Asegúrate de que 'auth' y 'db' estén exportados desde aquí
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Iniciar sesión en Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Consultar la base de datos para obtener el rol del usuario
      const usersRef = collection(db, 'usuarios');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const rolId = userDoc.rol_id;

        // Redirigir según el rol del usuario
        switch (rolId) {
          case 1: // Estudiante
            navigate('/dashboard');
            break;
          case 2: // Profesor
            navigate('/dashboard');
            break;
          case 3: // Funcionario
            navigate('/dashboard');
            break;
          case 4: // Administrador
            navigate('/bookcrud');
            break;
          default:
            navigate('/'); // Redirige a una página predeterminada si el rol no está definido
            break;
        }
      } else {
        alert('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error.message);
      alert(`Error durante el inicio de sesión: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Iniciar sesión
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tu correo electrónico</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="nombre@gmail.com" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tu contraseña</label>
              <input 
                type="password" 
                name="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="••••••••" 
                required 
              />
            </div>
            <button type="submit" 
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Iniciar sesión
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              ¿No tienes una cuenta? <a onClick={() => navigate('/register')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
