// app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

// Importer la configuration passport
require('./config/passport');

// Routes
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const participantRoutes = require('./routes/participantRoutes');
const activitesRoutes = require('./routes/activitesRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ NOUVEAU


const app = express();

// Middlewares de base
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

// ✅ ROUTES - ORDRE TRÈS IMPORTANT
console.log('🔧 Configuration des routes...');

app.use('/api/auth', authRoutes);
console.log('✅ Route /api/auth configurée');

app.use('/api/admin-auth', adminAuthRoutes);
console.log('✅ Route /api/admin-auth configurée');

app.use('/api/password-reset', passwordResetRoutes);

app.use('/api/evenements', evenementRoutes);
console.log('✅ Route /api/evenements configurée');

app.use('/api/participant', participantRoutes);
console.log('✅ Route /api/participant configurée');

app.use('/api/activites', activitesRoutes);
console.log('✅ Route /api/activites configurée');

// ✅ NOUVELLE ROUTE: Notifications
app.use('/api/notifications', notificationRoutes);
console.log('✅ Route /api/notifications configurée');

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Serveur Evenia opérationnel',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth',
      '/api/admin-auth',
      '/api/evenements',
      '/api/participant',
      '/api/activites',
      '/api/notifications'
    ]
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  console.log('❌ Route 404:', req.method, req.path);
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
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
  console.log('\n' + '='.repeat(60));
  console.log('✅ SERVEUR EVENIA DÉMARRÉ AVEC SUCCÈS');
  console.log('='.repeat(60));
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('\n📋 Routes disponibles:');
  console.log('   - POST   /api/auth/register');
  console.log('   - POST   /api/auth/login');
  console.log('   - POST   /api/admin-auth/verify-admin-password ← ADMIN');
  console.log('   - GET    /api/evenements/mes-evenements');
  console.log('   - GET    /api/participant/evenements-disponibles');
  console.log('   - GET    /api/participant/mes-participations');
  console.log('   - GET    /api/activites/evenements');
  console.log('   - GET    /api/notifications ← NOUVEAU');
  console.log('   - GET    /api/health (test)');
  console.log('='.repeat(60) + '\n');
  
  // 🔔 Démarrer le système de rappels automatiques
  try {
    const reminderService = require('./services/reminderService');
    reminderService.startReminderScheduler();
  } catch (error) {
    console.error('⚠️ Service de rappels non disponible:', error.message);
    console.log('ℹ️ Le serveur fonctionne normalement sans les rappels automatiques');
  }
});

module.exports = app;