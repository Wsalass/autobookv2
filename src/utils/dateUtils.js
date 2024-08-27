export const formatDate = (date) => {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date');
    }
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  export const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  