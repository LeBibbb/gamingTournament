'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TeamsPage() {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [userTeam, setUserTeam] = useState(null);
  const [error, setError] = useState('');
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
    
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/teams');
        setTeams(data);
        const existingTeam = data.find(team => team.participants.includes(storedUserId));
        setUserTeam(existingTeam);
      } catch (err) {
        setError("Erreur lors du chargement des équipes.");
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (userTeam) {
        setError("Vous avez déjà créé une équipe.");
        return;
    }

    try {
        const userId = localStorage.getItem("userId"); 
        const isAdmin = localStorage.getItem("isAdmin") === "true"; // Vérifier si l'utilisateur est admin

        const { data } = await axios.post("http://localhost:5000/teams", { 
            name: teamName, 
            userId, 
            isAdmin 
        });

        setTeams([...teams, data]);
        setUserTeam(data);
        setTeamName("");
    } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de la création de l'équipe.");
    }
};


const handleDeleteTeam = async (teamId) => {
  if (!(isAdmin || userTeam._id === teamId)) {
    setError("Vous ne pouvez supprimer que votre propre équipe ou celle d'un autre utilisateur si vous êtes admin.");
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/teams/${teamId}`);
    setTeams(teams.filter(team => team._id !== teamId));
    setUserTeam(null);
  } catch (err) {
    setError("Erreur lors de la suppression de l'équipe.");
  }
};

  return (
    <div className="container mt-5">
      <h1>Liste des Équipes</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!userTeam && (
        <form onSubmit={handleCreateTeam} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Nom de l'équipe</label>
            <input
              type="text"
              className="form-control"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Créer une équipe</button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team._id}>
              <td>{team.name}</td>
              <td>{team.participants.length}</td>
              <td>
                  {(userTeam?._id === team._id || isAdmin) && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteTeam(team._id)}
                    >
                      Supprimer
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
