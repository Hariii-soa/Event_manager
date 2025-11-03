// models/roleModel.js
const db = require('../config/db');

class Role {
  static async getIdByName(nomRole) {
    const query = 'SELECT id_role FROM role WHERE nom_role = $1';
    const { rows } = await db.query(query, [nomRole]);
    return rows[0]?.id_role;
  }

  static async createDefaultRoles() {
    const roles = ['admin', 'participant'];
    for (const role of roles) {
      const query = `
        INSERT INTO role (nom_role)
        SELECT $1
        WHERE NOT EXISTS (SELECT 1 FROM role WHERE nom_role = $1)
      `;
      await db.query(query, [role]);
    }
  }
}

module.exports = Role;
