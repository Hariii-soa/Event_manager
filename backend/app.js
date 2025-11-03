
// app.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes'); 

const app = express();

// Middleware de sécurité
app.use(cors());
app.use(helmet());
app.use(express.json()); // Pour parser le JSON

const passport = require('passport');
require('./config/passport');

app.use(passport.initialize());

// Limiter les requêtes pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Port d'écoute
const PORT = process.env.PORT || 3000; // Port de ton serveur Node.js
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
