import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import icono from "../img/icono.png";

const Header = ({ isLoggedIn, rol_id }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <header className="shadow-md border-b border-black bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={icono} alt="Logo" className="w-12 h-12 mr-2" />
          <span className="text-xl font-bold">Autobooks</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Inicio</Link>
          {isLoggedIn ? (
            <>
              <Link to="/catalog" className="hover:text-yellow-400 transition-colors">Catálogo</Link>
              {rol_id === 4 && (
                <Link to="/bookcrud" className="hover:text-yellow-400 transition-colors">CRUD de Libros</Link>
              )}
              <button
                onClick={handleLogout}
                className="hover:text-yellow-400 transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/catalog" className="hover:text-yellow-400 transition-colors">Catalogo</Link>
            </>
          )}
          <div className="ml-4">
            <ThemeToggleButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
