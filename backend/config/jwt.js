// config/jwt.js
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'votre_secret_jwt_changez_moi_en_production_2024',
  expiresIn: '7d'
};
// Dans config/jwt.js - TEMPORAIRE POUR DEBUG
console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Défini' : '❌ MANQUANT');
console.log('📏 Longueur:', process.env.JWT_SECRET?.length);