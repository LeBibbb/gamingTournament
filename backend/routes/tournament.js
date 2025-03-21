const express = require("express");
const jwt = require("jsonwebtoken");
const Tournament = require("../models/Tournament");

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est un administrateur
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
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find(); // Récupérer tous les tournois
    res.json(tournaments); // Retourner la liste des tournois
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

// Suppression d'un tournoi
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Suppression du tournoi par son ID
    const tournament = await Tournament.findByIdAndDelete(id);

    // Si le tournoi n'existe pas
    if (!tournament) {
      return res.status(404).json({ message: "Tournoi non trouvé" });
    }

    // Retourner une réponse de succès
    res.status(200).json({ message: "Tournoi supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du tournoi" });
  }
});

module.exports = router;
