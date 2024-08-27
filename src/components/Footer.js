import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-4 border-t border-gray-600 dark:border-gray-600">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Autobooks. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
