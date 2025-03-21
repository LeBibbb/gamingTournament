const mongoose = require('mongoose');
const path = require('path');
const User = require(path.resolve(__dirname, '../models/User')); // Utilisation du chemin absolu
require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env

// Connexion à la base de données avec MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à la base de données'))
  .catch(err => {
    console.error('Erreur de connexion à la base de données', err);
    process.exit(1); // Arrêter l'exécution du script si la connexion échoue
  });

const createAdmin = async () => {
  const username = 'adminUser';
  const email = 'admin@example.com';
  const password = 'adminPassword123'; // Utilise un mot de passe fort ici
  const role = 'admin';  // Spécifie que c'est un administrateur

  // Vérifier si l'utilisateur admin existe déjà
  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log('Cet administrateur existe déjà');
    return;
  }

  // Créer un administrateur
  const adminUser = new User({
    username,
    email,
    password, // Mot de passe en clair
    role, // Rôle 'admin'
  });

  await adminUser.save();
  console.log('Administrateur créé avec succès');
  mongoose.disconnect(); // Déconnecter après la création de l'administrateur
};

createAdmin();
