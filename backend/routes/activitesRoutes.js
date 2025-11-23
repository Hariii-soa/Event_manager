
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  verifyAdmin,
  getEvenementsForAdmin,
  getParticipantsByEvenement,
  accepterParticipation,
  refuserParticipation,
  annulerParticipation,
  getActivitiesStats
} = require('../controllers/activitesController');

// Toutes les routes nécessitent authentification
router.use(verifyToken);

// Toutes les routes nécessitent d'être admin
router.use(verifyAdmin);

// Récupérer les statistiques des activités
router.get('/stats', getActivitiesStats);

// Récupérer tous les événements (pour le dropdown)
router.get('/evenements', getEvenementsForAdmin);

// Récupérer les participants d'un événement spécifique
router.get('/evenement/:id_evenement/participants', getParticipantsByEvenement);

// Accepter une participation
router.put('/participation/:id_participation/accepter', accepterParticipation);

// Refuser une participation
router.put('/participation/:id_participation/refuser', refuserParticipation);

// Annuler une participation
router.delete('/participation/:id_participation', annulerParticipation);

module.exports = router;