const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom de l'equipe
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des participants
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
