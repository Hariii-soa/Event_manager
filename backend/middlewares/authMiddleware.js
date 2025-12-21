// middlewares/authMiddleware.js
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// ✅ Validation complète pour l'inscription
const validateRegistration = [
  body('nom')
    .notEmpty().withMessage('Le nom est requis.')
    .trim()
    .customSanitizer(value => value.toUpperCase()) // Convertir en majuscules
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  
  body('prenom')
    .notEmpty().withMessage('Le prénom est requis.')
    .trim()
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  
  body('email')
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  
  body('tel')
    .notEmpty().withMessage('Le numéro de téléphone est requis.')
    .matches(/^[0-9]{10}$/).withMessage('Le numéro de téléphone doit contenir exactement 10 chiffres.')
    .trim(),
  
  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[@$!%*?&#]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#).'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Erreurs de validation',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  },
];

// ✅ Validation pour la connexion
const validateLogin = [
  body('email')
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  
  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Erreurs de validation',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  },
];

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔍 Vérification token...');
  console.log('📋 Authorization header:', authHeader);
  console.log('🎫 Token extrait:', token ? 'Présent' : 'Absent');

  if (!token) {
    console.log('❌ Token manquant');
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    console.log('🔐 JWT Secret:', jwtConfig.secret ? 'Défini' : 'MANQUANT');
    
    const decoded = jwt.verify(token, jwtConfig.secret);
    console.log('✅ Token décodé:', decoded);
    
    req.user = { id: decoded.id };
    console.log('✅ Utilisateur authentifié - ID:', decoded.id);
    
    next();
  } catch (error) {
    console.error('❌ Erreur vérification token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expiré' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token invalide' });
    }
    
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = { 
  validateRegistration, 
  validateLogin, 
  verifyToken 
};