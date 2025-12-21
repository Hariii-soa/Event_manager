// models/notificationModel.js
const db = require('../config/db');

class Notification {
  static async create(notificationData) {
    try {
      const query = `
        INSERT INTO notification (
          email_destinataire, 
          type_notification, 
          titre, 
          message, 
          id_evenement
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        notificationData.email_destinataire,
        notificationData.type_notification,
        notificationData.titre,
        notificationData.message,
        notificationData.id_evenement || null
      ];
      const { rows } = await db.query(query, values);
      console.log('✅ Notification créée:', rows[0].id_notification);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur create notification:', error);
      throw error;
    }
  }

  static async findByEmail(email, limit = 50) {
    try {
      const query = `
        SELECT 
          n.*,
          e.titre as evenement_titre,
          e.code_evenement,
          e.date_evenement
        FROM notification n
        LEFT JOIN evenement e ON n.id_evenement = e.id_evenement
        WHERE n.email_destinataire = $1
        ORDER BY n.created_at DESC
        LIMIT $2
      `;
      const { rows } = await db.query(query, [email, limit]);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findByEmail:', error);
      throw error;
    }
  }

  static async findUnreadByEmail(email) {
    try {
      const query = `
        SELECT 
          n.*,
          e.titre as evenement_titre,
          e.code_evenement,
          e.date_evenement
        FROM notification n
        LEFT JOIN evenement e ON n.id_evenement = e.id_evenement
        WHERE n.email_destinataire = $1 AND n.lu = FALSE
        ORDER BY n.created_at DESC
      `;
      const { rows } = await db.query(query, [email]);
      return rows;
    } catch (error) {
      console.error('❌ Erreur findUnreadByEmail:', error);
      throw error;
    }
  }

  static async countUnreadByEmail(email) {
    try {
      const query = `
        SELECT COUNT(*) as total
        FROM notification
        WHERE email_destinataire = $1 AND lu = FALSE
      `;
      const { rows } = await db.query(query, [email]);
      return parseInt(rows[0].total);
    } catch (error) {
      console.error('❌ Erreur countUnreadByEmail:', error);
      throw error;
    }
  }

  static async markAsRead(id_notification) {
    try {
      const query = `
        UPDATE notification
        SET lu = TRUE, lu_at = CURRENT_TIMESTAMP
        WHERE id_notification = $1
        RETURNING *
      `;
      const { rows } = await db.query(query, [id_notification]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur markAsRead:', error);
      throw error;
    }
  }

  static async markAllAsReadByEmail(email) {
    try {
      const query = `
        UPDATE notification
        SET lu = TRUE, lu_at = CURRENT_TIMESTAMP
        WHERE email_destinataire = $1 AND lu = FALSE
        RETURNING *
      `;
      const { rows } = await db.query(query, [email]);
      return rows;
    } catch (error) {
      console.error('❌ Erreur markAllAsReadByEmail:', error);
      throw error;
    }
  }

  static async delete(id_notification) {
    try {
      const query = 'DELETE FROM notification WHERE id_notification = $1 RETURNING *';
      const { rows } = await db.query(query, [id_notification]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur delete notification:', error);
      throw error;
    }
  }

  static async deleteAllByEmail(email) {
    try {
      const query = 'DELETE FROM notification WHERE email_destinataire = $1 RETURNING *';
      const { rows } = await db.query(query, [email]);
      return rows;
    } catch (error) {
      console.error('❌ Erreur deleteAllByEmail:', error);
      throw error;
    }
  }

  static async getStatsByEmail(email) {
    try {
      const query = `
        SELECT * FROM notification_stats
        WHERE email_destinataire = $1
      `;
      const { rows } = await db.query(query, [email]);
      return rows[0] || {
        email_destinataire: email,
        total_notifications: 0,
        non_lues: 0,
        lues: 0,
        derniere_notification: null
      };
    } catch (error) {
      console.error('❌ Erreur getStatsByEmail:', error);
      throw error;
    }
  }
}

module.exports = Notification;