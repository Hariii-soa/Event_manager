// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const reminderService = require('../services/reminderService');

// Route pour tester manuellement l'envoi de rappels (admin seulement)
router.post('/test-reminders', verifyToken, async (req, res) => {
  try {
    console.log('🧪 Test manuel des rappels déclenché par:', req.user.id);
    
    // Vérifier si l'utilisateur est admin
    const db = require('../config/db');
    const { rows } = await db.query(
      'SELECT email FROM utilisateur WHERE id_utilisateur = $1',
      [req.user.id]
    );
    
    const ADMIN_EMAIL = 'harisoamarina21@gmail.com';
    if (!rows[0] || rows[0].email !== ADMIN_EMAIL) {
      return res.status(403).json({ 
        error: 'Accès refusé. Seul l\'administrateur peut tester les rappels.' 
      });
    }
    
    // Exécuter l'envoi des rappels
    await reminderService.sendEventReminders();
    
    res.status(200).json({
      message: 'Test des rappels exécuté avec succès',
      info: 'Vérifiez les logs du serveur pour voir les résultats'
    });
  } catch (error) {
    console.error('❌ Erreur test rappels:', error);
    res.status(500).json({ 
      error: 'Erreur lors du test des rappels',
      details: error.message 
    });
  }
});

// Route pour obtenir les statistiques des rappels
router.get('/reminder-stats', verifyToken, async (req, res) => {
  try {
    const db = require('../config/db');
    
    const query = `
      SELECT 
        COUNT(*) as total_reminders_sent,
        COUNT(DISTINCT id_participation) as unique_participants,
        MAX(sent_at) as last_reminder_sent,
        MIN(sent_at) as first_reminder_sent
      FROM event_reminders
    `;
    
    const { rows } = await db.query(query);
    
    res.status(200).json({
      stats: rows[0],
      message: 'Statistiques des rappels récupérées avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur stats rappels:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

module.exports = router;