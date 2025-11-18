// routes/evenementRoutes.js
const express = require('express');
const router = express.Router();

// Import direct des fonctions (pas de "EvenementController")
const {
  verifyAdmin,
  getMesEvenements,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement,
  uploadEvenementImage
} = require('../controllers/evenementController');

const { verifyToken } = require('../middlewares/authMiddleware');

// Middleware d'authentification pour TOUTES les routes de ce fichier
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/mes-evenements', getMesEvenements);
router.get('/:id', getEvenementById);

// Routes réservées à l'administrateur (email : harisoamarina21@gmail.com)
router.post(
  '/',
  verifyAdmin,                 // ← middleware qui vérifie que c'est l'admin
  uploadEvenementImage,        // ← upload de l'image
  createEvenement              // ← création de l'événement
);

router.put(
  '/:id',
  verifyAdmin,
  uploadEvenementImage,
  updateEvenement
);

router.delete(
  '/:id',
  verifyAdmin,
  deleteEvenement
);

module.exports = router;