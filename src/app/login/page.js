'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? '/users/login' : '/users/register';  // L'URL commence bien par /users
      const { data } = await axios.post(`http://localhost:5000${url}`, formData);
      
      if (isLogin) {
        // En cas de connexion réussie, on récupère le token, userId et role et les stocke
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);  // Stocke le userId
        localStorage.setItem('username', data.username);  // Stocke le nom d'utilisateur
        localStorage.setItem('role', data.role);  // Stocke le rôle
        router.push('/');  // Redirige vers la page d'accueil après la connexion
      } else {
        alert('Inscription réussie, vous pouvez maintenant vous connecter.');
        setIsLogin(true);  // Passe à l'écran de connexion
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center">{isLogin ? 'Connexion' : 'Inscription'}</h2>
        <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Vous n'avez pas de compte ? Inscrivez-vous" : 'Déjà un compte ? Connectez-vous'}
        </button>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                className="form-control"
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
