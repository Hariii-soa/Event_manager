// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Utilisateur = require('../models/utilisateurModel');
const AuthService = require('../services/authService');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile); // DEBUG

    const email = profile.emails[0].value;
    let user = await Utilisateur.findByEmail(email);

    if (!user) {
      // Crée un utilisateur si inexistant
      user = await Utilisateur.create(
        profile.name.familyName || 'Inconnu',
        profile.name.givenName || 'Inconnu',
        email,
        '', // tel vide
        Math.random().toString() // mot de passe aléatoire (non utilisé)
      );
    }

    // Retourne l'utilisateur SANS mot_de_passe
    const { mot_de_passe, ...safeUser } = user;
    done(null, safeUser); // ← IMPORTANT : passe safeUser
  } catch (error) {
    console.error('Erreur Google Strategy:', error);
    done(error, null);
  }
}));

module.exports = passport;