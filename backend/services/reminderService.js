// services/reminderService.js
const cron = require('node-cron');
const db = require('../config/db');
const mailService = require('./mailService');
const notificationService = require('./notificationService');

// Fonction pour envoyer les rappels 72h avant l'événement
const sendEventReminders = async () => {
  try {
    console.log('🔔 Vérification des événements nécessitant un rappel...');
    
    // Calculer la date dans 72 heures (3 jours)
    const now = new Date();
    const in72Hours = new Date(now.getTime() + (72 * 60 * 60 * 1000));
    
    // Plage de temps : entre 71h et 73h pour éviter les doublons
    const startWindow = new Date(now.getTime() + (71 * 60 * 60 * 1000));
    const endWindow = new Date(now.getTime() + (73 * 60 * 60 * 1000));
    
    console.log('📅 Recherche des événements entre', startWindow.toISOString(), 'et', endWindow.toISOString());
    
    // Récupérer les événements dans les 72h avec leurs participants acceptés
    const query = `
      SELECT 
        e.id_evenement,
        e.titre,
        e.code_evenement,
        e.date_evenement,
        e.lieu,
        e.description,
        p.id_participation,
        p.prenom,
        p.nom,
        p.email,
        p.statut
      FROM evenement e
      INNER JOIN participant p ON e.id_evenement = p.id_evenement
      WHERE p.statut = 'accepté'
        AND e.date_evenement BETWEEN $1 AND $2
        AND NOT EXISTS (
          SELECT 1 FROM event_reminders 
          WHERE event_reminders.id_participation = p.id_participation
        )
      ORDER BY e.date_evenement ASC
    `;
    
    const { rows } = await db.query(query, [startWindow, endWindow]);
    
    console.log(`✅ ${rows.length} rappel(s) à envoyer`);
    
    if (rows.length === 0) {
      console.log('ℹ️ Aucun rappel à envoyer pour le moment');
      return;
    }
    
    // Envoyer un email de rappel à chaque participant
    let successCount = 0;
    let errorCount = 0;
    
    for (const participant of rows) {
      try {
        // Envoyer l'email de rappel
        await mailService.sendEventReminderEmail(
          participant.email,
          participant.prenom,
          participant.nom,
          participant.titre,
          participant.date_evenement,
          participant.lieu,
          participant.description,
          participant.code_evenement
        );
        // 🔔 Créer notification in-app
await notificationService.createRappelNotification(
  participant.email, participant.prenom, participant.nom,
  evenement.titre, evenement.date_evenement, evenement.lieu,
  evenement.code_evenement, evenement.id_evenement
);
        
        // Marquer ce rappel comme envoyé dans la base de données
        await markReminderAsSent(participant.id_participation);
        
        successCount++;
        console.log(`✅ Rappel envoyé à ${participant.prenom} ${participant.nom} (${participant.email}) pour "${participant.titre}"`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Erreur envoi rappel à ${participant.email}:`, error.message);
      }
    }
    
    console.log(`📊 Résumé: ${successCount} rappels envoyés, ${errorCount} erreurs`);
    
  } catch (error) {
    console.error('❌ Erreur dans sendEventReminders:', error);
  }
};

// Marquer un rappel comme envoyé pour éviter les doublons
const markReminderAsSent = async (id_participation) => {
  try {
    const query = `
      INSERT INTO event_reminders (id_participation, sent_at)
      VALUES ($1, NOW())
      ON CONFLICT (id_participation) DO NOTHING
    `;
    await db.query(query, [id_participation]);
  } catch (error) {
    console.error('❌ Erreur markReminderAsSent:', error);
  }
};

// Démarrer le système de rappels automatiques
const startReminderScheduler = () => {
  console.log('🚀 Démarrage du système de rappels automatiques...');
  
  // Créer la table event_reminders si elle n'existe pas
  initReminderTable();
  
  // Exécuter toutes les heures (à la minute 0)
  // Format cron: minute heure jour mois jour_semaine
  cron.schedule('0 * * * *', async () => {
    console.log('\n⏰ Tâche planifiée : Vérification des rappels d\'événements');
    await sendEventReminders();
  });
  
  // Exécuter immédiatement au démarrage (optionnel, pour test)
  console.log('🔍 Vérification initiale des rappels...');
  setTimeout(() => {
    sendEventReminders();
  }, 5000); // Attendre 5 secondes après le démarrage
  
  console.log('✅ Système de rappels automatiques démarré');
  console.log('📅 Les rappels seront vérifiés toutes les heures');
};

// Créer la table pour suivre les rappels envoyés
const initReminderTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS event_reminders (
        id_reminder SERIAL PRIMARY KEY,
        id_participation INTEGER NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_participation) REFERENCES participant(id_participation) ON DELETE CASCADE,
        UNIQUE(id_participation)
      );
      
      CREATE INDEX IF NOT EXISTS idx_event_reminders_participation 
      ON event_reminders(id_participation);
    `;
    await db.query(query);
    console.log('✅ Table event_reminders initialisée');
  } catch (error) {
    console.error('❌ Erreur initReminderTable:', error);
  }
};

// Fonction pour tester manuellement l'envoi de rappels
const testReminder = async () => {
  console.log('🧪 Test manuel du système de rappels...');
  await sendEventReminders();
};

module.exports = {
  startReminderScheduler,
  sendEventReminders,
  testReminder
};