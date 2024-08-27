export const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  export const validatePassword = (password) => {
    // Al menos 8 caracteres, una letra y un número
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  };
  