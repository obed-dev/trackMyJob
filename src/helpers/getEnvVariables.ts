export const getEnvVariables = () => {
    return {
      api_URL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api', // Valor por defecto
    };
  };