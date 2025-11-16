// middlewares/authMiddleware.js
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const validateRegistration = [
  body('nom').notEmpty().withMessage('Le nom est requis.'),
  body('prenom').notEmpty().withMessage('Le prénom est requis.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email').isEmail().withMessage('Email invalide.'),
  body('motDePasse').notEmpty().withMessage('Le mot de passe est requis.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = { id: decoded.id }; // Ajoute l'ID utilisateur à la requête
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = { 
  validateRegistration, 
  validateLogin, 
  verifyToken 
};