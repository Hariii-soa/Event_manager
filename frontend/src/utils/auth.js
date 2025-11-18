// src/utils/auth.js

// Vérifier si le token est expiré
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Décoder le JWT (sans vérification de signature)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    const expiration = payload.exp * 1000; // Convertir en millisecondes
    
    return Date.now() >= expiration;
  } catch (error) {
    console.error('Erreur décodage token:', error);
    return true;
  }
};

// Obtenir le token et vérifier sa validité
export const getValidToken = () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    if (isTokenExpired(token)) {
      // Token expiré, nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Erreur récupération token:', error);
    return null;
  }
};

// Déconnecter l'utilisateur
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};