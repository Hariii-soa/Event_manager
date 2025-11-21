// routes/participantRoutes.js
const express = require('express');
const router = express.Router();

const {
  getEvenementsDisponibles,
  inscrireParticipant,
  getParticipantsByEvenement,
  annulerParticipation,
  getMesParticipations
} = require('../controllers/participantController');

const { verifyToken } = require('../middlewares/authMiddleware');

// Routes publiques (sans authentification pour la page de participation)
// Récupérer tous les événements disponibles
router.get('/evenements-disponibles', getEvenementsDisponibles);

// S'inscrire à un événement (pas besoin d'être authentifié)
router.post('/inscrire/:id_evenement', inscrireParticipant);

// Routes protégées (nécessitent authentification)
router.use(verifyToken);

// Récupérer les participants d'un événement (pour l'organisateur)
router.get('/evenement/:id_evenement/participants', getParticipantsByEvenement);

// Annuler une participation (pour l'organisateur)
router.delete('/participation/:id_participation', annulerParticipation);

// Récupérer les participations d'un utilisateur par email
router.get('/mes-participations', getMesParticipations);

module.exports = router;