'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TournamentPage() {
  const [formData, setFormData] = useState({ name: '', game: '', date: '' });
  const [error, setError] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedRole === 'admin') {
      setIsAdmin(true);
    }

    // Récupérer tous les tournois
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/tournaments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTournaments(data);
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
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (tournamentId) => {
    if (!isAdmin) {
      setError("Vous devez être un administrateur pour supprimer un tournoi.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTournaments(tournaments.filter((tournament) => tournament._id !== tournamentId));
    } catch (err) {
      setError('Erreur lors de la suppression du tournoi.');
      console.error(err);
    }
  };

  const handleJoinTournament = async (tournamentId) => {
    if (!userId) {
      setError("Vous devez être connecté pour vous inscrire à un tournoi.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/tournaments/${tournamentId}/join`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Inscription réussie !');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  const handleUnsubscribe = async (tournamentId) => {
    if (!userId) {
      setError("Vous devez être connecté pour vous désinscrire d'un tournoi.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/tournaments/${tournamentId}/unsubscribe`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Désinscription réussie !');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Liste des Tournois</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Jeu</th>
            <th>Date</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament._id}>
              <td>{tournament.name}</td>
              <td>{tournament.game}</td>
              <td>{new Date(tournament.date).toLocaleDateString()}</td>
              <td>{tournament.participants.length}</td>
              <td>
                {!isAdmin && (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleJoinTournament(tournament._id)}
                    >
                      S'inscrire
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleUnsubscribe(tournament._id)}
                    >
                      Se désinscrire
                    </button>
                  </>
                )}
                {isAdmin && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(tournament._id)}
                  >
                    <i className="bi bi-trash"></i> Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
