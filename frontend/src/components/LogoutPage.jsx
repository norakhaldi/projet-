// LogoutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function LogoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold">Vous êtes déconnecté</h1>
      <p className="mt-4">Merci de votre visite !</p>
      <Link to="/" className="text-maroon hover:underline mt-4 inline-block">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default LogoutPage;