
const crypto = require('crypto');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const mailService = require('../services/mailService');

// Demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    
    console.log('🔑 Demande de réinitialisation pour:', email);
    
    // Vérifier si l'utilisateur existe
    const userQuery = 'SELECT * FROM utilisateur WHERE email = $1';
    const { rows } = await db.query(userQuery, [email]);
    
    if (rows.length === 0) {
      // Pour des raisons de sécurité, on renvoie le même message même si l'email n'existe pas
      return res.status(200).json({ 
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation' 
      });
    }
    
    const user = rows[0];
    
    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure
    
    // Sauvegarder le token dans la base de données
    const updateQuery = `
      UPDATE utilisateur 
      SET reset_token = $1, reset_token_expiry = $2 
      WHERE id_utilisateur = $3
    `;
    await db.query(updateQuery, [resetTokenHash, resetTokenExpiry, user.id_utilisateur]);
    
    // Envoyer l'email avec le lien de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await mailService.sendPasswordResetEmail(user.email, user.prenom, user.nom, resetUrl);
    
    console.log('✅ Email de réinitialisation envoyé à:', email);
    
    res.status(200).json({ 
      message: 'Si cet email existe, vous recevrez un lien de réinitialisation' 
    });
  } catch (error) {
    console.error('❌ Erreur requestPasswordReset:', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, nouveauMotDePasse } = req.body;
    
    if (!token || !nouveauMotDePasse) {
      return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    }
    
    // Valider le mot de passe
    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({ 
        error: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }
    
    console.log('🔑 Tentative de réinitialisation avec token');
    
    // Hasher le token pour le comparer
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Trouver l'utilisateur avec ce token valide
    const userQuery = `
      SELECT * FROM utilisateur 
      WHERE reset_token = $1 AND reset_token_expiry > NOW()
    `;
    const { rows } = await db.query(userQuery, [resetTokenHash]);
    
    if (rows.length === 0) {
      return res.status(400).json({ 
        error: 'Token invalide ou expiré. Veuillez faire une nouvelle demande.' 
      });
    }
    
    const user = rows[0];
    
    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
    
    // Mettre à jour le mot de passe et supprimer le token
    const updateQuery = `
      UPDATE utilisateur 
      SET mot_de_passe = $1, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id_utilisateur = $2
    `;
    await db.query(updateQuery, [hashedPassword, user.id_utilisateur]);
    
    // Envoyer un email de confirmation
    await mailService.sendPasswordChangedEmail(user.email, user.prenom, user.nom);
    
    console.log('✅ Mot de passe réinitialisé pour:', user.email);
    
    res.status(200).json({ 
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' 
    });
  } catch (error) {
    console.error('❌ Erreur resetPassword:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

// Vérifier la validité d'un token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }
    
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const userQuery = `
      SELECT id_utilisateur FROM utilisateur 
      WHERE reset_token = $1 AND reset_token_expiry > NOW()
    `;
    const { rows } = await db.query(userQuery, [resetTokenHash]);
    
    if (rows.length === 0) {
      return res.status(400).json({ 
        valid: false,
        error: 'Token invalide ou expiré' 
      });
    }
    
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('❌ Erreur verifyResetToken:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du token' });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  verifyResetToken
};