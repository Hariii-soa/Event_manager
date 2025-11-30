// controllers/participantController.js
const Participant = require('../models/participantModel');
const Evenement = require('../models/evenementModel');
const mailService = require('../services/mailService');

// Récupérer tous les événements publics disponibles pour participation
const getEvenementsDisponibles = async (req, res) => {
  try {
    console.log('📋 Récupération des événements disponibles...');
    
    const evenements = await Evenement.findAllPublic();
    
    console.log('✅ Événements disponibles:', evenements.length);
    res.status(200).json(evenements);
  } catch (error) {
    console.error('❌ Erreur getEvenementsDisponibles:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des événements disponibles' 
    });
  }
};

// S'inscrire à un événement avec envoi d'email de confirmation
const inscrireParticipant = async (req, res) => {
  try {
    const { id_evenement } = req.params;
    const { prenom, nom, email, telephone } = req.body;

    console.log('📝 Inscription à l\'événement ID:', id_evenement);
    console.log('📋 Données participant:', { prenom, nom, email });

    // Validation des champs
    if (!prenom || !nom || !email || !telephone) {
      return res.status(400).json({ 
        error: 'Tous les champs sont obligatoires' 
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Email invalide' 
      });
    }

    // Vérifier si l'événement existe
    const evenement = await Evenement.findById(id_evenement);
    if (!evenement) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }

    // Vérifier si l'événement est déjà passé
    const eventDate = new Date(evenement.date_evenement);
    const now = new Date();
    if (eventDate < now) {
      return res.status(400).json({ 
        error: 'Cet événement est déjà terminé' 
      });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const isAlreadyRegistered = await Participant.isAlreadyRegistered(id_evenement, email);
    if (isAlreadyRegistered) {
      return res.status(400).json({ 
        error: 'Vous êtes déjà inscrit à cet événement' 
      });
    }

    // Vérifier s'il reste des places
    const participantsCount = await Participant.countByEvenement(id_evenement);
    if (participantsCount >= evenement.nombre_places) {
      return res.status(400).json({ 
        error: 'Désolé, cet événement est complet' 
      });
    }

    // Créer la participation avec statut "en attente"
    const nouvelleParticipation = await Participant.create({
      id_evenement,
      prenom,
      nom,
      email,
      telephone
    });

    console.log('✅ Participation créée avec statut:', nouvelleParticipation.statut);

    // ✅ ENVOI D'EMAIL DE CONFIRMATION D'INSCRIPTION
    try {
      await mailService.sendRegistrationConfirmationEmail(
        email,
        prenom,
        nom,
        evenement.titre,
        evenement.code_evenement
      );
      console.log('✅ Email de confirmation envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email (inscription enregistrée quand même):', emailError);
      // On continue même si l'email échoue
    }

    res.status(201).json({
      message: 'Inscription réussie ! Votre demande est en attente de validation. Un email de confirmation vous a été envoyé.',
      participation: nouvelleParticipation
    });
  } catch (error) {
    console.error('❌ Erreur inscrireParticipant:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Vous êtes déjà inscrit à cet événement' 
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de l\'inscription',
      details: error.message 
    });
  }
};

// Récupérer les participants d'un événement (pour l'organisateur)
const getParticipantsByEvenement = async (req, res) => {
  try {
    const { id_evenement } = req.params;
    const id_utilisateur = req.user.id;

    console.log('📋 Récupération participants événement ID:', id_evenement);

    const isOrganisateur = await Evenement.isOrganisateur(id_evenement, id_utilisateur);
    if (!isOrganisateur) {
      return res.status(403).json({ 
        error: 'Non autorisé à voir les participants de cet événement' 
      });
    }

    const participants = await Participant.findByEvenement(id_evenement);

    console.log('✅ Participants trouvés:', participants.length);
    res.status(200).json(participants);
  } catch (error) {
    console.error('❌ Erreur getParticipantsByEvenement:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des participants' 
    });
  }
};

// Annuler une participation (pour l'organisateur)
const annulerParticipation = async (req, res) => {
  try {
    const { id_participation } = req.params;
    const id_utilisateur = req.user.id;

    console.log('🗑️ Annulation participation ID:', id_participation);

    const participationQuery = 'SELECT id_evenement FROM participant WHERE id_participation = $1';
    const db = require('../config/db');
    const { rows } = await db.query(participationQuery, [id_participation]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }

    const isOrganisateur = await Evenement.isOrganisateur(rows[0].id_evenement, id_utilisateur);
    if (!isOrganisateur) {
      return res.status(403).json({ 
        error: 'Non autorisé à annuler cette participation' 
      });
    }

    const participationSupprimee = await Participant.delete(id_participation);

    if (!participationSupprimee) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }

    console.log('✅ Participation annulée');
    res.status(200).json({ 
      message: 'Participation annulée avec succès' 
    });
  } catch (error) {
    console.error('❌ Erreur annulerParticipation:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'annulation de la participation' 
    });
  }
};

// Récupérer les événements auxquels un utilisateur participe
const getMesParticipations = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email requis' 
      });
    }

    console.log('📋 Récupération participations pour:', email);

    const evenements = await Participant.findEventsByEmail(email);

    console.log('✅ Participations trouvées:', evenements.length);
    res.status(200).json(evenements);
  } catch (error) {
    console.error('❌ Erreur getMesParticipations:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des participations' 
    });
  }
};

module.exports = {
  getEvenementsDisponibles,
  inscrireParticipant,
  getParticipantsByEvenement,
  annulerParticipation,
  getMesParticipations
};