// config/jwt.js
module.exports = {
  secret: process.env.JWT_SECRET || 'ta_cle_secrete_ultra_securisee',
  expiresIn: '24h', // Durée de validité du token
};
