// routes/evenementRoutes.js
const express = require('express');
const router = express.Router();
const { EvenementController, uploadEvenementImage } = require('../controllers/evenementController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Middleware d'authentification pour toutes les routes
router.use(verifyToken);

// Routes
router.get('/mes-evenements', EvenementController.getMesEvenements);
router.get('/:id', EvenementController.getEvenementById);

// Route de création avec vérification admin ET upload
router.post('/', 
  EvenementController.verifyAdmin,
  uploadEvenementImage,  // Upload APRÈS vérification admin
  EvenementController.createEvenement
);

router.put('/:id', 
  EvenementController.verifyAdmin,
  uploadEvenementImage, 
  EvenementController.updateEvenement
);

router.delete('/:id', 
  EvenementController.verifyAdmin,
  EvenementController.deleteEvenement
);

module.exports = router;