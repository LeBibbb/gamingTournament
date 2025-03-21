'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [loading, setLoading] = useState(true); // Nouveau state pour gérer le chargement
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');

    if (storedUser) {
      setUserName(storedUser);
    }

    if (storedRole === 'admin') {
      setIsAdmin(true);
    }

    setLoading(false); // Une fois que les données sont récupérées, on termine le chargement
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUserName(null);
    setIsAdmin(false);
    router.push('/login');
  };

  if (loading) {
    // Affiche un indicateur de chargement (par exemple, un spinner) pendant le chargement
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Gaming Tournament</span>
        </div>
      </nav>
    );
  }

  return (
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
              {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" href="/admin">Utilisateurs</Link>
                  </li>
                )}
              {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" href="/tournament">Tournois</Link>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link">Bienvenue, {userName}</span>
                </li>
                
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}><i class="bi bi-box-arrow-right"></i></button>
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
  );
}
