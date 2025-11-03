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
    // Cherche l'utilisateur par email Google
    let user = await Utilisateur.findByEmail(profile.emails[0].value);
    
    if (!user) {
      // Crée un nouvel utilisateur si inexistant (remplis les champs manquants par défaut)
      user = await Utilisateur.create(
        profile.name.familyName || '',  
        profile.name.givenName || '',   
        profile.emails[0].value,               
        profile.phone || '',                   
        'google-auth'                          // mot de passe dummy (pas utilisé pour Google)
      );
    }
    
    // Retourne l'utilisateur sans mot de passe
    const userProfile = { ...user };
    delete userProfile.mot_de_passe;
    
    done(null, userProfile);
  } catch (error) {
    console.error(error);
    done(error, null);
  }
}));

// Sérialisation pour la session (optionnel, car on utilise JWT)
passport.serializeUser((user, done) => done(null, user.id_utilisateur));
passport.deserializeUser(async (id, done) => {
  // Ici, tu peux fetch l'utilisateur complet si besoin
  done(null, { id });
});