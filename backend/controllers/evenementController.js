// controllers/evenementController.js
const Evenement = require('../models/evenementModel');
const multer = require('multer');
const path = require('path');

// Email de l'administrateur autorisé
const ADMIN_EMAIL = 'harisoamarina21@gmail.com';

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/evenements/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées'));
  }
});

class EvenementController {
  // Middleware pour vérifier si l'utilisateur est admin
  static async verifyAdmin(req, res, next) {
    try {
      const userId = req.user.id;
      
      // Récupérer l'utilisateur depuis la base de données
      const query = 'SELECT email FROM utilisateur WHERE id_utilisateur = $1';
      const db = require('../config/db');
      const { rows } = await db.query(query, [userId]);
      
      if (!rows[0]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si c'est l'admin
      if (rows[0].email !== ADMIN_EMAIL) {
        return res.status(403).json({ 
          error: 'Accès refusé. Seul l\'administrateur peut créer des événements.' 
        });
      }
      
      next();
    } catch (error) {
      console.error('Erreur verifyAdmin:', error);
      res.status(500).json({ error: 'Erreur de vérification des permissions' });
    }
  }

  // Récupérer tous les événements de l'organisateur
  static async getMesEvenements(req, res) {
    try {
      const id_utilisateur = req.user.id;
      const evenements = await Evenement.findByOrganisateur(id_utilisateur);
      
      res.status(200).json(evenements);
    } catch (error) {
      console.error('Erreur getMesEvenements:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
  }

  // Récupérer un événement par ID
  static async getEvenementById(req, res) {
    try {
      const { id } = req.params;
      const evenement = await Evenement.findById(id);
      
      if (!evenement) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      res.status(200).json(evenement);
    } catch (error) {
      console.error('Erreur getEvenementById:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
    }
  }

  // Créer un nouvel événement
  static async createEvenement(req, res) {
    try {
      const id_utilisateur = req.user.id;
      const evenementData = req.body;
      
      console.log('📝 Données reçues:', evenementData);
      console.log('🖼️ Fichier reçu:', req.file);
      
      // Validation des champs requis
      if (!evenementData.code_evenement || !evenementData.titre || 
          !evenementData.date_evenement || !evenementData.lieu || 
          !evenementData.nombre_places) {
        return res.status(400).json({ 
          error: 'Tous les champs obligatoires doivent être remplis' 
        });
      }
      
      // Ajouter l'URL de l'image si elle a été uploadée
      if (req.file) {
        evenementData.image_url = `/uploads/evenements/${req.file.filename}`;
        console.log('✅ Image URL:', evenementData.image_url);
      }
      
      const nouvelEvenement = await Evenement.create(evenementData, id_utilisateur);
      
      console.log('✅ Événement créé:', nouvelEvenement);
      
      res.status(201).json({
        message: 'Événement créé avec succès',
        evenement: nouvelEvenement
      });
    } catch (error) {
      console.error('❌ Erreur createEvenement:', error);
      
      // Gestion des erreurs spécifiques
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Ce code d\'événement existe déjà' 
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'événement',
        details: error.message 
      });
    }
  }

  // Mettre à jour un événement
  static async updateEvenement(req, res) {
    try {
      const { id } = req.params;
      const id_utilisateur = req.user.id;
      const evenementData = req.body;
      
      // Vérifier que l'utilisateur est bien l'organisateur
      const isOrganisateur = await Evenement.isOrganisateur(id, id_utilisateur);
      if (!isOrganisateur) {
        return res.status(403).json({ error: 'Non autorisé à modifier cet événement' });
      }
      
      // Ajouter l'URL de l'image si elle a été uploadée
      if (req.file) {
        evenementData.image_url = `/uploads/evenements/${req.file.filename}`;
      }
      
      const evenementMisAJour = await Evenement.update(id, evenementData);
      
      if (!evenementMisAJour) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      res.status(200).json({
        message: 'Événement mis à jour avec succès',
        evenement: evenementMisAJour
      });
    } catch (error) {
      console.error('Erreur updateEvenement:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
    }
  }

  // Supprimer un événement
  static async deleteEvenement(req, res) {
    try {
      const { id } = req.params;
      const id_utilisateur = req.user.id;
      
      // Vérifier que l'utilisateur est bien l'organisateur
      const isOrganisateur = await Evenement.isOrganisateur(id, id_utilisateur);
      if (!isOrganisateur) {
        return res.status(403).json({ error: 'Non autorisé à supprimer cet événement' });
      }
      
      const evenementSupprime = await Evenement.delete(id);
      
      if (!evenementSupprime) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
      
      res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
      console.error('Erreur deleteEvenement:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
    }
  }
}

// Export du controller et du middleware upload
module.exports = {
  EvenementController,
  uploadEvenementImage: upload.single('image')
};