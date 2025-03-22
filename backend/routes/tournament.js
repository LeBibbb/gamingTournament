const express = require("express");
const jwt = require("jsonwebtoken");
const Tournament = require("../models/Tournament");

const router = express.Router();

// Suppression d'un tournoi
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournoi non trouvé" });
    }
    res.json({ message: "Tournoi supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
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
