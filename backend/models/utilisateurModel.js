// models/utilisateurModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Utilisateur {
  static async findByEmail(email) {
    const query = 'SELECT * FROM utilisateur WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  static async create(nom, prenom, email, tel, motDePasse) {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const query = `
      INSERT INTO utilisateur (nom, prenom, email, tel, mot_de_passe)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [nom, prenom, email, tel, hashedPassword];
    const { rows } = await db.query(query, values);
    return rows[0]; // Retourne l'objet complet avec id_utilisateur
  }
}

module.exports = Utilisateur;