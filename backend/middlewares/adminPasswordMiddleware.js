
const crypto = require('crypto');

// Mot de passe admin en clair (à changer en production)
// Idéalement, ce mot de passe devrait être stocké de manière sécurisée en base de données et hashé
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123@';

// Hasher le mot de passe
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Middleware pour vérifier le mot de passe admin
const verifyAdminPassword = (req, res, next) => {
  try {
    const { adminPassword } = req.body;
    
    if (!adminPassword) {
      return res.status(400).json({ error: 'Mot de passe administrateur requis' });
    }
    
    // Comparer les mots de passe
    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe administrateur incorrect' });
    }
    
    console.log('✅ Authentification admin réussie');
    next();
  } catch (error) {
    console.error('❌ Erreur vérification mot de passe admin:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
  }
};

module.exports = { verifyAdminPassword, hashPassword };