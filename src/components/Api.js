export const createAuthenticatedRequest = (token) => {
    return async (url, options = {}) => {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.status === 401) {
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
  
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    };
  };