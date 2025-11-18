// src/utils/api.js

const API_URL = 'http://localhost:3000/api';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/login';
    throw new Error('Token manquant');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Gérer l'expiration du token
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expirée');
    }

    return response;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};