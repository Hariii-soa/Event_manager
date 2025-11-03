// services/authService.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  }
}

module.exports = AuthService;


