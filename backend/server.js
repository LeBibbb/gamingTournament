const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assure-toi que le modèle User est bien défini
const userRoutes = require("./routes/users");  // Assure-toi que ce chemin est correct
const tournamentRoutes = require("./routes/tournament");


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Montée des routes utilisateurs
app.use('/users', userRoutes);  // Assurez-vous que toutes les routes commencent par /users


app.use("/tournaments", tournamentRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
