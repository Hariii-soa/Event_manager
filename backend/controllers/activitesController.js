// controllers/activitesController.js
const Participant = require('../models/participantModel');
const Evenement = require('../models/evenementModel');
const mailService = require('../services/mailService');

const ADMIN_EMAIL = 'harisoamarina21@gmail.com';

// Vérifier si l'utilisateur est admin
const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const query = 'SELECT email FROM utilisateur WHERE id_utilisateur = $1';
    const db = require('../config/db');
    const { rows } = await db.query(query, [userId]);
    
    if (!rows[0]) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    if (rows[0].email !== ADMIN_EMAIL) {
      return res.status(403).json({ 
        error: 'Accès refusé. Seul l\'administrateur peut accéder à cette section.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Erreur verifyAdmin:', error);
    res.status(500).json({ error: 'Erreur de vérification des permissions' });
  }
};

// Récupérer tous les événements (pour le dropdown) - REQUÊTE CORRIGÉE
const getEvenementsForAdmin = async (req, res) => {
  try {
    // ✅ Ajout des alias de table (e. et p.) pour éviter l'ambiguïté
    const query = `
      SELECT 
        e.id_evenement,
        e.code_evenement,
        e.titre,
        e.date_evenement,
        e.lieu,
        e.nombre_places,
        COALESCE(COUNT(p.id_participation), 0)::INTEGER as nombre_participants_actuels
      FROM evenement e
      LEFT JOIN participant p ON e.id_evenement = p.id_evenement
      GROUP BY e.id_evenement, e.code_evenement, e.titre, e.date_evenement, e.lieu, e.nombre_places
      ORDER BY e.date_evenement DESC
    `;
    
    const db = require('../config/db');
    const { rows } = await db.query(query);
    
    console.log('✅ Événements récupérés:', rows.length);
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Erreur getEvenementsForAdmin:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
};

// Récupérer les participants d'un événement spécifique
const getParticipantsByEvenement = async (req, res) => {
  try {
    const { id_evenement } = req.params;
    
    console.log('📋 Récupération des participants pour l\'événement:', id_evenement);
    
    // Vérifier que l'événement existe
    const evenement = await Evenement.findById(id_evenement);
    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    // Récupérer les participants
    const participants = await Participant.findByEvenement(id_evenement);
    
    console.log('✅ Participants trouvés:', participants.length);
    res.status(200).json({
      evenement: {
        id_evenement: evenement.id_evenement,
        titre: evenement.titre,
        code_evenement: evenement.code_evenement,
        date_evenement: evenement.date_evenement,
        lieu: evenement.lieu
      },
      participants: participants
    });
  } catch (error) {
    console.error('❌ Erreur getParticipantsByEvenement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des participants' });
  }
};

// Accepter une participation
const accepterParticipation = async (req, res) => {
  try {
    const { id_participation } = req.params;
    
    console.log('✅ Acceptation participation ID:', id_participation);
    
    // Récupérer la participation
    const participant = await Participant.findById(id_participation);
    if (!participant) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }
    
    // Vérifier que ce n'est pas déjà accepté
    if (participant.statut === 'accepté') {
      return res.status(400).json({ error: 'Cette participation est déjà acceptée' });
    }
    
    // Mettre à jour le statut à "accepté"
    const participationMiseAJour = await Participant.updateStatut(id_participation, 'accepté');
    
    // Récupérer les informations de l'événement pour l'email
    const evenement = await Evenement.findById(participant.id_evenement);
    
    // Envoyer un email de confirmation
    await mailService.sendAcceptanceEmail(
      participant.email,
      participant.prenom,
      participant.nom,
      evenement.titre,
      evenement.date_evenement,
      evenement.lieu
    );
    
    console.log('✅ Email de confirmation envoyé à:', participant.email);
    
    res.status(200).json({
      message: 'Participation acceptée et email envoyé',
      participation: participationMiseAJour
    });
  } catch (error) {
    console.error('❌ Erreur accepterParticipation:', error);
    res.status(500).json({ error: 'Erreur lors de l\'acceptation de la participation' });
  }
};

// Refuser une participation
const refuserParticipation = async (req, res) => {
  try {
    const { id_participation } = req.params;
    const { raison } = req.body;
    
    console.log('❌ Refus participation ID:', id_participation);
    
    // Récupérer la participation
    const participant = await Participant.findById(id_participation);
    if (!participant) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }
    
    // Vérifier que ce n'est pas déjà refusé
    if (participant.statut === 'refusé') {
      return res.status(400).json({ error: 'Cette participation est déjà refusée' });
    }
    
    // Mettre à jour le statut à "refusé"
    const participationMiseAJour = await Participant.updateStatut(id_participation, 'refusé');
    
    // Récupérer les informations de l'événement pour l'email
    const evenement = await Evenement.findById(participant.id_evenement);
    
    // Envoyer un email de refus
    await mailService.sendRejectionEmail(
      participant.email,
      participant.prenom,
      participant.nom,
      evenement.titre,
      raison || 'Aucune raison spécifiée'
    );
    
    console.log('✅ Email de refus envoyé à:', participant.email);
    
    res.status(200).json({
      message: 'Participation refusée et email envoyé',
      participation: participationMiseAJour
    });
  } catch (error) {
    console.error('❌ Erreur refuserParticipation:', error);
    res.status(500).json({ error: 'Erreur lors du refus de la participation' });
  }
};

// Annuler une participation (suppression)
const annulerParticipation = async (req, res) => {
  try {
    const { id_participation } = req.params;
    
    console.log('🗑️ Annulation participation ID:', id_participation);
    
    // Récupérer la participation avant suppression
    const participant = await Participant.findById(id_participation);
    if (!participant) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }
    
    // Supprimer la participation
    await Participant.delete(id_participation);
    
    console.log('✅ Participation supprimée');
    
    res.status(200).json({ 
      message: 'Participation annulée avec succès' 
    });
  } catch (error) {
    console.error('❌ Erreur annulerParticipation:', error);
    res.status(500).json({ error: 'Erreur lors de l\'annulation de la participation' });
  }
};

// Récupérer les statistiques globales des activités
const getActivitiesStats = async (req, res) => {
  try {
    const db = require('../config/db');
    
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM participant WHERE statut = 'en attente') as en_attente,
        (SELECT COUNT(*) FROM participant WHERE statut = 'accepté') as acceptes,
        (SELECT COUNT(*) FROM participant WHERE statut = 'refusé') as refuses,
        (SELECT COUNT(*) FROM participant) as total,
        (SELECT COUNT(*) FROM evenement) as nombre_evenements
    `;
    
    const { rows } = await db.query(query);
    
    console.log('✅ Statistiques récupérées');
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('❌ Erreur getActivitiesStats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

module.exports = {
  verifyAdmin,
  getEvenementsForAdmin,
  getParticipantsByEvenement,
  accepterParticipation,
  refuserParticipation,
  annulerParticipation,
  getActivitiesStats
};