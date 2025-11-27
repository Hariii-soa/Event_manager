// app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const participantRoutes = require('./routes/participantRoutes');
const activitesRoutes = require('./routes/activitesRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes'); // 🆕 AJOUT

// Importer la configuration passport
require('./config/passport');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialiser Passport (SANS session)
app.use(passport.initialize());

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/participant', participantRoutes);
app.use('/api/activites', activitesRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/password-reset', passwordResetRoutes); // 🆕 AJOUT

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Serveur Evenia opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📧 Service email: ${process.env.EMAIL_SERVICE || 'smtp'}`);
  console.log(`👤 Email configuré: ${process.env.EMAIL_USER || 'Non configuré'}`);
});