// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Utilisateur = require('../models/utilisateurModel');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔑 Google profile reçu:', profile.emails[0].value);

    const email = profile.emails[0].value;
    let user = await Utilisateur.findByEmail(email);

    if (!user) {
      console.log('👤 Création d\'un nouvel utilisateur...');
      // Créer un utilisateur si inexistant
      user = await Utilisateur.create(
        profile.name.familyName || 'Nom',
        profile.name.givenName || 'Prénom',
        email,
        '', // tel vide
        Math.random().toString(36).slice(-8) // mot de passe aléatoire
      );
      console.log('✅ Utilisateur créé:', user.id_utilisateur);
    } else {
      console.log('✅ Utilisateur existant:', user.id_utilisateur);
    }

    // Retourner l'utilisateur SANS mot_de_passe
    const { mot_de_passe, ...safeUser } = user;
    done(null, safeUser);
  } catch (error) {
    console.error('❌ Erreur Google Strategy:', error);
    done(error, null);
  }
}));

module.exports = passport;