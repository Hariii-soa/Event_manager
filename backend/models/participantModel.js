// models/participantModel.js
const db = require('../config/db');

class Participant {
  // Créer une participation
  static async create(participationData) {
    try {
      const query = `
        INSERT INTO participant (
          id_evenement, prenom, nom, email, telephone, statut
        )
        VALUES ($1, $2, $3, $4, $5, 'confirmé')
        RETURNING *
      `;
      const values = [
        participationData.id_evenement,
        participationData.prenom,
        participationData.nom,
        participationData.email,
        participationData.telephone
      ];
      const { rows } = await db.query(query, values);
      console.log('✅ Participation créée avec ID:', rows[0].id_participation);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur create participation:', error);
      throw error;
    }
  }

  // Vérifier si un email est déjà inscrit à un événement
  static async isAlreadyRegistered(id_evenement, email) {
    try {
      const query = `
        SELECT id_participation FROM participant 
        WHERE id_evenement = $1 AND email = $2
      `;
      const { rows } = await db.query(query, [id_evenement, email]);
      return rows.length > 0;
    } catch (error) {
      console.error('❌ Erreur isAlreadyRegistered:', error);
      throw error;
    }
  }

  // Récupérer tous les participants d'un événement
  static async findByEvenement(id_evenement) {
    try {
      const query = `
        SELECT 
          p.*,
          TO_CHAR(p.date_inscription, 'DD/MM/YYYY à HH24:MI') as date_inscription_formatee
        FROM participant p
        WHERE p.id_evenement = $1
        ORDER BY p.date_inscription DESC
      `;
      const { rows } = await db.query(query, [id_evenement]);
      console.log('✅ Participants trouvés:', rows.length);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findByEvenement:', error);
      throw error;
    }
  }

  // Compter le nombre de participants d'un événement
  static async countByEvenement(id_evenement) {
    try {
      const query = `
        SELECT COUNT(*) as total
        FROM participant
        WHERE id_evenement = $1
      `;
      const { rows } = await db.query(query, [id_evenement]);
      const count = parseInt(rows[0].total, 10);
      console.log('✅ Nombre de participants:', count);
      return count;
    } catch (error) {
      console.error('❌ Erreur countByEvenement:', error);
      throw error;
    }
  }

  // Récupérer une participation par ID
  static async findById(id_participation) {
    try {
      const query = `
        SELECT * FROM participant 
        WHERE id_participation = $1
      `;
      const { rows } = await db.query(query, [id_participation]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur findById:', error);
      throw error;
    }
  }

  // Supprimer une participation
  static async delete(id_participation) {
    try {
      const query = 'DELETE FROM participant WHERE id_participation = $1 RETURNING *';
      const { rows } = await db.query(query, [id_participation]);
      console.log('✅ Participation supprimée');
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur delete:', error);
      throw error;
    }
  }

  // Récupérer les événements auxquels un utilisateur participe (par email)
  static async findEventsByEmail(email) {
    try {
      const query = `
        SELECT 
          e.*,
          p.id_participation,
          p.date_inscription,
          p.prenom,
          p.nom,
          p.email as participant_email,
          p.statut,
          COALESCE(part_count.participants, 0) as nombre_participants_actuels
        FROM participant p
        INNER JOIN evenement e ON p.id_evenement = e.id_evenement
        LEFT JOIN (
          SELECT id_evenement, COUNT(*) as participants
          FROM participant
          GROUP BY id_evenement
        ) part_count ON e.id_evenement = part_count.id_evenement
        WHERE p.email = $1
        ORDER BY e.date_evenement ASC
      `;
      const { rows } = await db.query(query, [email]);
      console.log('✅ Participations trouvées:', rows.length);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findEventsByEmail:', error);
      throw error;
    }
  }

  // Récupérer les participations d'un utilisateur par ID (pour admin)
  static async findByUtilisateur(id_utilisateur) {
    try {
      const query = `
        SELECT 
          p.*,
          e.titre as evenement_titre,
          e.date_evenement,
          e.lieu
        FROM participant p
        INNER JOIN evenement e ON p.id_evenement = e.id_evenement
        WHERE p.id_utilisateur = $1
        ORDER BY e.date_evenement DESC
      `;
      const { rows } = await db.query(query, [id_utilisateur]);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findByUtilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une participation
  static async updateStatut(id_participation, statut) {
    try {
      const query = `
        UPDATE participant
        SET statut = $1
        WHERE id_participation = $2
        RETURNING *
      `;
      const { rows } = await db.query(query, [statut, id_participation]);
      console.log('✅ Statut mis à jour');
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur updateStatut:', error);
      throw error;
    }
  }
}

module.exports = Participant;