// routes/passwordResetRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  requestPasswordReset,
  resetPassword,
  verifyResetToken
} = require('../controllers/passwordResetController');

// Validation pour la demande de réinitialisation
const validateResetRequest = [
  body('email').isEmail().withMessage('Email invalide')
];

// Validation pour la réinitialisation
const validatePasswordReset = [
  body('token').notEmpty().withMessage('Token requis'),
  body('nouveauMotDePasse')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// ✅ CORRECTION: Route pour demander la réinitialisation (envoie l'email)
router.post('/request', validateResetRequest, requestPasswordReset);

// ✅ CORRECTION: Route pour réinitialiser le mot de passe
router.post('/reset', validatePasswordReset, resetPassword);

// ✅ CORRECTION: Route pour vérifier la validité d'un token
router.get('/verify/:token', verifyResetToken);

module.exports = router;