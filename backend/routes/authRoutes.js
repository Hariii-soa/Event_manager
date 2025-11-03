// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

const AuthController = require('../controllers/authController');
const { validateRegistration } = require('../middlewares/authMiddleware');
const { validateLogin } = require('../middlewares/authMiddleware'); 

router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Route d'initiation Google OAuth
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Callback après authentification Google
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // req.user contient le profil Google
    const token = AuthService.generateToken(req.user.id_utilisateur);
    
    // Redirige vers frontend avec token (via query param, ou utilise un cookie sécurisé)
    const frontendUrl = `${process.env.FRONTEND_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(frontendUrl);
  }
);

module.exports = router;
