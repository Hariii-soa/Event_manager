// app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const participantRoutes = require('./routes/participantRoutes');
const path = require('path');

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

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});