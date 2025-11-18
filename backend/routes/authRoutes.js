// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/authController');
const AuthService = require('../services/authService');
const { validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

// Routes classiques
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Route d'initiation Google OAuth
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false
}));

// Callback Google OAuth - CORRIGÉ
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`
  }),
  (req, res) => {
    try {
      console.log('📝 Callback Google - User:', req.user);
      
      if (!req.user) {
        console.error('❌ Aucun utilisateur dans req.user');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user`);
      }

      // Générer le token JWT
      const token = AuthService.generateToken(req.user.id_utilisateur);
      
      const user = {
        id: req.user.id_utilisateur,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
      };

      console.log('✅ Token généré pour:', user.email);

      // CORRECTION: Rediriger vers la page d'accueil "/" au lieu de "/login"
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(
        `${frontendUrl}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
      );
    } catch (error) {
      console.error('❌ Erreur callback Google:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_failed`);
    }
  }
);

module.exports = router;