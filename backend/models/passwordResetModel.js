// models/passwordResetModel.js
const db = require('../config/db');
const crypto = require('crypto');

class PasswordReset {
  // Créer un token de réinitialisation
  static async createResetToken(email) {
    try {
      // Générer un token unique
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // Expire dans 1 heure

      const query = `
        INSERT INTO password_reset (email, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const values = [email, token, expiresAt];
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur createResetToken:', error);
      throw error;
    }
  }

  // Vérifier si un token est valide
  static async findValidToken(token) {
    try {
      const query = `
        SELECT * FROM password_reset
        WHERE token = $1 AND expires_at > NOW() AND used = false
      `;
      const { rows } = await db.query(query, [token]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur findValidToken:', error);
      throw error;
    }
  }

  // Marquer un token comme utilisé
  static async markAsUsed(token) {
    try {
      const query = `
        UPDATE password_reset
        SET used = true
        WHERE token = $1
        RETURNING *
      `;
      const { rows } = await db.query(query, [token]);
      return rows[0];
    } catch (error) {
      console.error('❌ Erreur markAsUsed:', error);
      throw error;
    }
  }

  // Supprimer les tokens expirés (nettoyage)
  static async cleanExpiredTokens() {
    try {
      const query = 'DELETE FROM password_reset WHERE expires_at < NOW()';
      await db.query(query);
    } catch (error) {
      console.error('❌ Erreur cleanExpiredTokens:', error);
      throw error;
    }
  }
}

module.exports = PasswordReset;