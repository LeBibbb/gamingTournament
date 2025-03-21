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

const deleteAdmin = async () => {
  const email = 'admin@example.com'; // L'email de l'ancien admin à supprimer

  // Vérifier si l'utilisateur admin existe
  const existingAdmin = await User.findOne({ email });
  if (!existingAdmin) {
    console.log('Aucun administrateur trouvé avec cet email');
    return;
  }

  // Supprimer l'administrateur
  await User.deleteOne({ email });
  console.log('Administrateur supprimé avec succès');
  mongoose.disconnect(); // Déconnecter après la suppression de l'administrateur
};

deleteAdmin();
