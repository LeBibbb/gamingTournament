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
      <div className="container mt-5">
        <h1>Bienvenue sur Gaming Tournament</h1>
        <p>Participez à des tournois, affrontez d'autres joueurs et devenez un champion !</p>
      </div>
    </div>
  );
}
