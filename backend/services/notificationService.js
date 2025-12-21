// services/notificationService.js
const Notification = require('../models/notificationModel');

const createInscriptionNotification = async (email, prenom, nom, evenementTitre, evenementCode, idEvenement) => {
  try {
    const notificationData = {
      email_destinataire: email,
      type_notification: 'inscription_confirmee',
      titre: '📋 Inscription reçue',
      message: `Bonjour ${prenom} ${nom}, votre inscription à l'événement "${evenementTitre}" (Code: ${evenementCode}) a bien été reçue et est en attente de validation.`,
      id_evenement: idEvenement
    };

    const notification = await Notification.create(notificationData);
    console.log('✅ Notification inscription créée:', notification.id_notification);
    return notification;
  } catch (error) {
    console.error('❌ Erreur création notification inscription:', error);
    return null;
  }
};

const createAcceptationNotification = async (email, prenom, nom, evenementTitre, dateEvenement, lieu, idEvenement) => {
  try {
    const dateFormatted = new Date(dateEvenement).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const notificationData = {
      email_destinataire: email,
      type_notification: 'acceptation',
      titre: '✅ Inscription acceptée !',
      message: `Félicitations ${prenom} ${nom} ! Votre inscription à "${evenementTitre}" a été acceptée. Rendez-vous le ${dateFormatted} à ${lieu}.`,
      id_evenement: idEvenement
    };

    const notification = await Notification.create(notificationData);
    console.log('✅ Notification acceptation créée:', notification.id_notification);
    return notification;
  } catch (error) {
    console.error('❌ Erreur création notification acceptation:', error);
    return null;
  }
};

const createRefusNotification = async (email, prenom, nom, evenementTitre, raison, idEvenement) => {
  try {
    const notificationData = {
      email_destinataire: email,
      type_notification: 'refus',
      titre: '❌ Inscription refusée',
      message: `Bonjour ${prenom} ${nom}, votre inscription à "${evenementTitre}" a été refusée. Raison: ${raison || 'Non spécifiée'}`,
      id_evenement: idEvenement
    };

    const notification = await Notification.create(notificationData);
    console.log('✅ Notification refus créée:', notification.id_notification);
    return notification;
  } catch (error) {
    console.error('❌ Erreur création notification refus:', error);
    return null;
  }
};

const createRappelNotification = async (email, prenom, nom, evenementTitre, dateEvenement, lieu, code, idEvenement) => {
  try {
    const dateFormatted = new Date(dateEvenement).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const notificationData = {
      email_destinataire: email,
      type_notification: 'rappel_evenement',
      titre: '🔔 Rappel : Événement dans 3 jours',
      message: `Bonjour ${prenom} ${nom}, rappel : "${evenementTitre}" (Code: ${code}) aura lieu le ${dateFormatted} à ${lieu}. Préparez-vous !`,
      id_evenement: idEvenement
    };

    const notification = await Notification.create(notificationData);
    console.log('✅ Notification rappel créée:', notification.id_notification);
    return notification;
  } catch (error) {
    console.error('❌ Erreur création notification rappel:', error);
    return null;
  }
};

module.exports = {
  createInscriptionNotification,
  createAcceptationNotification,
  createRefusNotification,
  createRappelNotification
};