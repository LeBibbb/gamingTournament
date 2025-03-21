// frontend/src/app/layout.js
import Navbar from '../components/Navbar'; // Importer le composant Navbar
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assure-toi d'importer Bootstrap globalement

export const metadata = {
  title: 'Gaming Tournament',
  description: 'Page d\'accueil du tournoi de jeux vidéo',
};

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar /> {/* Ajouter la navbar sur chaque page */}
        <main>{children}</main>
      </body>
    </html>
  );
}
