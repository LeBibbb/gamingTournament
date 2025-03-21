'use client';  // Directive pour indiquer que ce fichier est un composant client

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateTournamentPage() {
  const [formData, setFormData] = useState({ name: '', game: '', date: '' });
  const [tournaments, setTournaments] = useState([]); // Liste des tournois
  const [error, setError] = useState('');
  const router = useRouter();

  // Charger la liste des tournois au montage du composant
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token
        if (!token) {
          console.error("Token manquant");
          setError("Token manquant, veuillez vous reconnecter.");
          return;
        }

        // Faire la requête pour récupérer les tournois
        const response = await axios.get('http://localhost:5000/tournaments', {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
          },
        });

        setTournaments(response.data); // Mettre à jour la liste des tournois
      } catch (err) {
        setError('Erreur lors du chargement des tournois.');
        console.error(err);
      }
    };

    fetchTournaments();
  }, []); // Ne s'exécute qu'au montage du composant

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumettre le formulaire pour créer un tournoi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur avant la soumission
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/tournaments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Tournoi créé avec succès');
      router.push('/tournament'); // Rediriger après création
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du tournoi.');
    }
  };

  // Fonction pour supprimer un tournoi
  const handleDelete = async (tournamentId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token
      if (!token) {
        console.error("Token manquant");
        setError("Token manquant, veuillez vous reconnecter.");
        return;
      }

      // Faire la requête DELETE
      await axios.delete(`http://localhost:5000/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
        },
      });

      // Mise à jour de la liste des tournois après suppression
      setTournaments(tournaments.filter(tournament => tournament._id !== tournamentId));
    } catch (err) {
      setError('Erreur lors de la suppression du tournoi.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      {/* Formulaire de création de tournoi */}
      <div className="card p-4 shadow-sm">
        <h2 className="text-center">Créer un Tournoi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom du Tournoi</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Jeu</label>
            <input
              type="text"
              name="game"
              className="form-control"
              value={formData.game}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Créer le Tournoi
          </button>
        </form>
      </div>

      {/* Affichage des tournois existants */}
      <h2 className="mt-5">Gestion des Tournois</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Jeu</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament._id}>
              <td>{tournament._id}</td>
              <td>{tournament.name}</td>
              <td>{tournament.game}</td>
              <td>{tournament.date}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(tournament._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
