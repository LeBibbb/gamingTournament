'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token
        const response = await axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
          },
        });
        setUsers(response.data); // Stocker les utilisateurs récupérés dans l'état
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
        },
      });
      // Mettre à jour la liste des utilisateurs après suppression
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Gestion des utilisateurs</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nom d'utilisateur</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
              <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(user._id)}
                  >
                    <i className="bi bi-trash"></i>
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
