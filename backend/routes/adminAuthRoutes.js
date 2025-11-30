
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyAdminPassword } = require('../middlewares/adminPasswordMiddleware');

// Vérifier l'accès admin (authentification + mot de passe)
router.post('/verify-admin-password', verifyToken, verifyAdminPassword, (req, res) => {
  try {
    console.log('✅ Authentification admin réussie');
    res.status(200).json({
      message: 'Authentification admin réussie',
      authorized: true
    });
  } catch (error) {
    console.error('❌ Erreur authentification admin:', error);
    res.status(500).json({ error: 'Erreur lors de l\'authentification' });
  }
});

module.exports = router;