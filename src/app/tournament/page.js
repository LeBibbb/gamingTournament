'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateTournamentPage() {
  const [formData, setFormData] = useState({ name: '', game: '', date: '' });
  const [error, setError] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const router = useRouter();

  // Récupérer tous les tournois
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/tournaments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTournaments(data); // Met à jour l'état des tournois
      } catch (err) {
        setError('Erreur lors du chargement des tournois.');
        console.error(err);
      }
    };

    fetchTournaments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/tournaments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Tournoi créé avec succès');
      router.push('/tournament');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (tournamentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token manquant. Veuillez vous reconnecter.');
        return;
      }
  
      const response = await axios.delete(`http://localhost:5000/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Si la suppression est réussie, on met à jour la liste des tournois
      setTournaments(tournaments.filter((tournament) => tournament._id !== tournamentId));
      alert('Tournoi supprimé avec succès');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la suppression.';
      setError(errorMessage);
      console.error(err);
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center">Créer un Tournoi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom du Tournoi</label>
            <input
              type="text"
              name="name"
              className="form-control"
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

      {/* Tableau des tournois */}
      <div className="container mt-5">
        <h1>Liste des Tournois</h1>
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
                    <i className="bi bi-trash"></i> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
