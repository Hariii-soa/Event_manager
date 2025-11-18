// services/authService.js
const Utilisateur = require('../models/utilisateurModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthService {
  // Générer un token JWT
  static generateToken(userId) {
    console.log('🔑 Génération token pour userId:', userId);
    console.log('🔐 JWT Secret:', jwtConfig.secret ? '✅ Défini' : '❌ MANQUANT');
    
    if (!jwtConfig.secret) {
      throw new Error('JWT_SECRET n\'est pas défini');
    }
    
    const token = jwt.sign(
      { id: userId },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn || '24h' }
    );
    
    console.log('✅ Token généré avec succès');
    console.log('📝 Token:', token.substring(0, 20) + '...');
    return token;
  }

  // Inscription
  static async register(nom, prenom, email, tel, motDePasse) {
    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findByEmail(email);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer l'utilisateur
    const newUser = await Utilisateur.create(nom, prenom, email, tel, motDePasse);

    // Générer le token
    const token = this.generateToken(newUser.id_utilisateur);

    console.log('✅ Utilisateur créé:', {
      id: newUser.id_utilisateur,
      email: newUser.email,
      nom: newUser.nom,
      prenom: newUser.prenom
    });

    return {
      token,
      user: {
        id: newUser.id_utilisateur,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email
      }
    };
  }

  // Connexion
  static async login(email, motDePasse) {
    console.log('🔐 Tentative de connexion:', email);
    
    // Trouver l'utilisateur
    const user = await Utilisateur.findByEmail(email);
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      throw new Error('Email ou mot de passe incorrect');
    }

    console.log('✅ Utilisateur trouvé:', {
      id: user.id_utilisateur,
      email: user.email,
      nom: user.nom
    });

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      throw new Error('Email ou mot de passe incorrect');
    }

    console.log('✅ Mot de passe valide');

    // Générer le token
    const token = this.generateToken(user.id_utilisateur);

    return {
      token,
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      }
    };
  }
}

module.exports = AuthService;