// middlewares/authMiddleware.js
const { body, validationResult } = require('express-validator');
const passport = require('passport');
require('../config/passport');

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

module.exports = { validateRegistration, validateLogin };
