const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importer les routes
const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

// Utiliser les routes
app.use('/api/users', userRoutes);

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à la base de données'))
  .catch(err => console.log('Erreur de connexion à la base de données', err));

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
