const express = require("express");
const jwt = require("jsonwebtoken");
const Tournament = require("../models/Tournament");

const router = express.Router();

// Suppression d'un tournoi
router.delete("/:id", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé : token manquant" });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("Utilisateur décodé :", req.user);  // Débogage : afficher l'utilisateur décodé

    // Vérifier si l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }

    const { id } = req.params;

    // Suppression du tournoi par son ID
    const tournament = await Tournament.findByIdAndDelete(id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournoi non trouvé" });
    }

    res.status(200).json({ message: "Tournoi supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err); // Affichage de l'erreur de décryptage du token
    return res.status(400).json({ message: "Token invalide" });
  }
});

// Récupération des tournois
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

module.exports = router;
