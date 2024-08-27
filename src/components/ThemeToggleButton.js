import React, { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggle = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2   rounded transition-colors"
    >
      {darkMode ? ' cambia de color 🌞' : ' cambia de color🌙'}
    </button>
  );
};

export default ThemeToggleButton;
