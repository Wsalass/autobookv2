export const fetchFromApi = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  
  export const postToApi = async (url, data, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Post error:', error);
      throw error;
    }
  };
  