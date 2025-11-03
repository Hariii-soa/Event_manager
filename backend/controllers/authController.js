// controllers/authController.js
const Utilisateur = require('../models/utilisateurModel');
const AuthService = require('../services/authService');
const bcrypt = require('bcryptjs');

class AuthController {
  static async register(req, res) {
    try {
      const { nom, prenom, email, tel, motDePasse } = req.body;

      // Vérifie si l'utilisateur existe déjà
      const existingUser = await Utilisateur.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "L'email est déjà utilisé." });
      }

      // Crée l'utilisateur
      const newUser = await Utilisateur.create(nom, prenom, email, tel, motDePasse);

      // Génère un token JWT
      const token = AuthService.generateToken(newUser.id_utilisateur);

      // Réponse réussie
      res.status(201).json({
        message: "Inscription réussie !",
        token,
        user: {
          id: newUser.id_utilisateur,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
  }

  static async login(req, res) {
    try {
      const { email, motDePasse } = req.body;

      // Vérifie si l'utilisateur existe
      const user = await Utilisateur.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Email ou mot de passe incorrect." });
      }

      // Vérifie le mot de passe
      const isMatch = await bcrypt.compare(motDePasse, user.mot_de_passe);
      if (!isMatch) {
        return res.status(400).json({ error: "Email ou mot de passe incorrect." });
      }

      // Génère un token JWT
      const token = AuthService.generateToken(user.id_utilisateur);

      // Réponse réussie
      res.status(200).json({
        message: "Connexion réussie !",
        token,
        user: {
          id: user.id_utilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la connexion." });
    }
  }
}

module.exports = AuthController;
