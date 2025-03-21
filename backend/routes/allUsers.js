// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();

// // Middleware pour vérifier le token
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token du header

//   if (!token) {
//     return res.status(403).json({ message: 'Token manquant' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Token invalide' });
//     }
//     req.userId = decoded.id; // Ajouter l'ID de l'utilisateur décodé à la requête
//     next();
//   });
// };

// // Route pour récupérer tous les utilisateurs (avec authentification)
// router.get('/users', verifyToken, async (req, res) => {
//   try {
//     const users = await User.find(); // Récupérer tous les utilisateurs
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
//   }
// });

// module.exports = router;
