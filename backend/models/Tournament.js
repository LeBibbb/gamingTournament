const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom du tournoi
  game: { type: String, required: true }, // Jeu concerné
  date: { type: Date, required: true }, // Date du tournoi
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des participants
  status: { type: String, enum: ['open', 'in progress', 'finished'], default: 'open' } // Statut du tournoi
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
