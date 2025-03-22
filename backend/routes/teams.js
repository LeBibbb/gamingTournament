const express = require("express");
const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const teams = await Team.find();
      res.json(teams);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur du serveur" });
    }
  });

  router.post("/", async (req, res) => {
    const { name, userId, isAdmin } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: "Nom de l'équipe et utilisateur requis" });
    }

    try {
        // Vérifier si l'utilisateur a déjà une équipe (sauf s'il est admin)
        if (!isAdmin) {
            const existingTeam = await Team.findOne({ participants: userId });
            if (existingTeam) {
                return res.status(400).json({ message: "Vous avez déjà une équipe." });
            }
        }

        const newTeam = new Team({
            name,
            participants: [userId], // L'utilisateur devient le premier membre de son équipe
        });

        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la création de l'équipe" });
    }
});

  router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "team non trouvé" });
    }
    res.json({ message: "teeam supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Récupération des tournois
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

  router.post('/:teamID/join', async (req, res) => {
    const { teamID } = req.params;
    const { userId } = req.body;  // L'ID de l'utilisateur
  
    try {
      const team = await Team.findById(teamID);
      if (!team) {
        return res.status(404).json({ message: 'Tournoi non trouvé' });
      }
  
      // Vérifier si l'utilisateur est déjà inscrit
      if (team.participants.includes(userId)) {
        return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce tournoi' });
      }
  
      // Ajouter l'utilisateur à la liste des participants
      team.participants.push(userId);
      await team.save();
  
      res.status(200).json({ message: 'Inscription réussie' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  });
  
  
  // backend/routes/teams.js
  router.post('/:teamId/unsubscribe', async (req, res) => {
    const { teamId } = req.params;
    const { userId } = req.body;  // L'ID de l'utilisateur
  
    try {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team non trouvé' });
      }
  
      // Vérifier si l'utilisateur est inscrit
      const userIndex = team.participants.indexOf(userId);
      if (userIndex === -1) {
        return res.status(400).json({ message: 'Vous n\'êtes pas inscrit à cette equipe' });
      }
  
      // Retirer l'utilisateur de la liste des participants
      team.participants.splice(userIndex, 1);
      await team.save();
  
      res.status(200).json({ message: 'Désinscription réussie' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  });
 

module.exports = router;