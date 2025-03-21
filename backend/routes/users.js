const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    if (password !== user.password) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Générer un token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Inscription
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    const newUser = new User({ email, password, username, role: 'user' });

    await newUser.save();

    res.status(201).json({ message: "Inscription réussie, vous pouvez maintenant vous connecter." });
  } catch (err) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

// Suppression d'un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Récupérer la liste de tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Récupérer tous les utilisateurs
    res.json(users); // Retourner la liste des utilisateurs
  } catch (err) {
    res.status(500).json({ message: "Erreur du serveur", error: err });
  }
});

module.exports = router;
