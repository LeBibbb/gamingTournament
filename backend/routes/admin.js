// routes/admin.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware pour vérifier le token et l'autorisation d'admin
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Vérifier si l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: "Token invalide" });
  }
};


// Route pour obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Récupère tous les utilisateurs de la base de données
    console.log(users)
    res.json(users); // Renvoie la liste des utilisateurs au frontend
  } catch (err) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;


module.exports = router;
