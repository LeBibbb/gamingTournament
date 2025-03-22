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

// Création d'un tournoi
router.post("/", async (req, res) => {
  const { name, game, date } = req.body;

  if (!name || !game || !date) {
    return res.status(400).json({ message: "Nom, jeu et date sont requis" });
  }

  try {
    const newTournament = new Tournament({
      name,
      game,
      date,
      participants: [], // Initialisation vide pour la liste des participants
      status: 'open', // Statut par défaut
    });

    await newTournament.save();
    res.status(201).json(newTournament); // Retourne le tournoi créé
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du tournoi" });
    console.error(err);
  }
});



// Inscription d'un utilisateur à un tournoi
// backend/routes/tournaments.js
router.post('/:tournamentId/join', async (req, res) => {
  const { tournamentId } = req.params;
  const { userId } = req.body;  // L'ID de l'utilisateur

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    if (tournament.participants.includes(userId)) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce tournoi' });
    }

    // Ajouter l'utilisateur à la liste des participants
    tournament.participants.push(userId);
    await tournament.save();

    res.status(200).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});


// backend/routes/tournaments.js
router.post('/:tournamentId/unsubscribe', async (req, res) => {
  const { tournamentId } = req.params;
  const { userId } = req.body;  // L'ID de l'utilisateur

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier si l'utilisateur est inscrit
    const userIndex = tournament.participants.indexOf(userId);
    if (userIndex === -1) {
      return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à ce tournoi' });
    }

    // Retirer l'utilisateur de la liste des participants
    tournament.participants.splice(userIndex, 1);
    await tournament.save();

    res.status(200).json({ message: 'Désinscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;
