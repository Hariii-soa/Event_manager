// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/authController');
const AuthService = require('../services/authService'); // ⬅️ AJOUTEZ CETTE LIGNE
const { validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Route d'initiation Google OAuth
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Callback Google OAuth
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }

      const token = AuthService.generateToken(req.user.id_utilisateur);
      const user = {
        id: req.user.id_utilisateur,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
      };

      res.redirect(
        `${process.env.FRONTEND_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
      );
    } catch (error) {
      console.error('Erreur callback Google:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;