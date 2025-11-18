// models/evenementModel.js
const db = require('../config/db');

class Evenement {
  // Récupérer tous les événements d'un organisateur (SANS participant)
  static async findByOrganisateur(id_utilisateur) {
    try {
      const query = `
        SELECT 
          e.*,
          0 as nombre_participants_actuels
        FROM evenement e
        WHERE e.id_organisateur = $1
        ORDER BY e.created_at DESC
      `;
      const { rows } = await db.query(query, [id_utilisateur]);
      console.log('✅ Événements trouvés:', rows.length);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findByOrganisateur:', error);
      throw error;
    }
  }

  // Récupérer un événement par ID (SANS participant)
  static async findById(id_evenement) {
    try {
      const query = `
        SELECT 
          e.*,
          0 as nombre_participants_actuels
        FROM evenement e
        WHERE e.id_evenement = $1
      `;
      const { rows } = await db.query(query, [id_evenement]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur findById:', error);
      throw error;
    }
  }

  // Créer un nouvel événement
  static async create(evenementData, id_organisateur) {
    try {
      const query = `
        INSERT INTO evenement (
          code_evenement, titre, description, date_evenement, 
          lieu, nombre_places, image_url, id_organisateur
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        evenementData.code_evenement,
        evenementData.titre,
        evenementData.description || null,
        evenementData.date_evenement,
        evenementData.lieu,
        evenementData.nombre_places,
        evenementData.image_url || null,
        id_organisateur
      ];
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur create:', error);
      throw error;
    }
  }

  // Mettre à jour un événement
  static async update(id_evenement, evenementData) {
    try {
      const query = `
        UPDATE evenement
        SET 
          code_evenement = COALESCE($1, code_evenement),
          titre = COALESCE($2, titre),
          description = COALESCE($3, description),
          date_evenement = COALESCE($4, date_evenement),
          lieu = COALESCE($5, lieu),
          nombre_places = COALESCE($6, nombre_places),
          image_url = COALESCE($7, image_url)
        WHERE id_evenement = $8
        RETURNING *
      `;
      const values = [
        evenementData.code_evenement,
        evenementData.titre,
        evenementData.description,
        evenementData.date_evenement,
        evenementData.lieu,
        evenementData.nombre_places,
        evenementData.image_url,
        id_evenement
      ];
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur update:', error);
      throw error;
    }
  }

  // Supprimer un événement
  static async delete(id_evenement) {
    try {
      const query = 'DELETE FROM evenement WHERE id_evenement = $1 RETURNING *';
      const { rows } = await db.query(query, [id_evenement]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur delete:', error);
      throw error;
    }
  }

  // Vérifier si un utilisateur est l'organisateur
  static async isOrganisateur(id_evenement, id_utilisateur) {
    try {
      const query = 'SELECT id_organisateur FROM evenement WHERE id_evenement = $1';
      const { rows } = await db.query(query, [id_evenement]);
      return rows[0]?.id_organisateur === id_utilisateur;
    } catch (error) {
      console.error('❌ Erreur isOrganisateur:', error);
      throw error;
    }
  }
}

module.exports = Evenement;