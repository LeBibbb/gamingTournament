'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Variable pour vérifier si l'utilisateur est un admin
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');  // Récupère le rôle de l'utilisateur

    if (storedUser) {
      setUserName(storedUser);
    }

    if (storedRole === 'admin') {
      setIsAdmin(true);
    }

    console.log('Rôle récupéré:', storedRole);  // Vérifie le rôle récupéré depuis localStorage

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUserName(null);
    setIsAdmin(false);
    router.push('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" href="/">Gaming Tournament</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {userName ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Bienvenue, {userName}</span>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" href="/admin">Supprimer des utilisateurs</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Se déconnecter</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" href="/login">Connexion</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <h1>Bienvenue sur Gaming Tournament</h1>
        <p>Participez à des tournois, affrontez d'autres joueurs et devenez un champion !</p>
      </div>
    </div>
  );
}
