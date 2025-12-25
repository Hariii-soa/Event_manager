// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Evenia" className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">Evenia</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-pink-200 transition font-medium">
                Fonctionnalités
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-pink-200 transition font-medium">
                Comment ça marche
              </a>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-pink-200 transition font-medium"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-linear-to-r from-pink-200 to-purple-300 text-white rounded-lg hover:from-pink-200 hover:to-purple-300 transition font-medium"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-pink-100 text-blue-400 rounded-full text-sm font-medium">
                ✨ La plateforme de gestion d'événements
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Consultez vos événements en toute
                <span className="bg-linear-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent"> simplicité</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Participez et suivez vos activites avec vos événements en temps réel. 
                Evenia simplifie la gestion des inscriptions et automatise les notifications.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-linear-to-r from-pink-200 to-purple-300 text-white rounded-xl hover:from-pink-200 hover:to-purple-300 transition font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="material-icons">rocket_launch</span>
                  Commencer gratuitement
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition font-semibold text-lg"
                >
                  Se connecter
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">100+</p>
                  <p className="text-sm text-gray-600">Événements créés</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/management.png"
                  alt="Interface Evenia"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Evenia ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète avec  les fonctionnalités dont vous avez besoin!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-linear-to-br from-pink-50 to-pink-100 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                <span className="material-icons text-white text-2xl">event</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Participer a un événement</h3>
              <p className="text-gray-600">
                Interface intuitive pour consulter des événements avec tous les détails nécessaires avec participation gratuite
              </p>
            </div>

            

            {/* Feature Card 3 */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-300 rounded-xl flex items-center justify-center mb-4">
                <span className="material-icons text-white text-2xl">notifications</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications automatiques</h3>
              <p className="text-gray-600">
                Emails et rappels envoyés automatiquement aux participants
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center mb-4">
                <span className="material-icons text-white text-2xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Suivis en temps réel</h3>
              <p className="text-gray-600">
                Suivez la participation, l'engagement et les tendances de vos événements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple comme bonjour
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trois étapes pour organiser votre événement parfait
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-linear-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Consultez les événements disponibles</h3>
                <p className="text-gray-600">
                  Consultez le site pour voir les evenements disponibles du moment
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <span className="material-icons text-4xl text-pink-300">arrow_forward</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-linear-to-r from-purple-300 to-blue-100 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inscrivez-vous selon vos choix</h3>
                <p className="text-gray-600">
                  Inscrivez-vous aux evenements qui vous plaisent et recevez une notification, tous cela gratuitement
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <span className="material-icons text-4xl text-purple-300">arrow_forward</span>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-linear-to-r from-blue-300 to-green-200 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Consulter votre taux de participation</h3>
                <p className="text-gray-600">
                  Regardez quels sont les evenements dans lequel vous participez
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-pink-100 to-purple-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
            Prêt à simplifier vos événements ?
          </h2>
          <p className="text-xl text-black mb-8">
            Rejoignez les autres participants dans Evenia qui facilitent leurs agenda avec
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-blue-400 rounded-xl hover:bg-gray-100 transition font-bold text-lg shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            <span className="material-icons">rocket_launch</span>
            Créer mon compte gratuitement
          </button>
          
          <p className="text-black text-sm mt-6">
            Aucune carte bancaire requise • Configuration en 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Evenia" className="w-10 h-10" />
                <span className="text-2xl font-bold">Evenia</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme de gestion d'événements qui simplifie votre vie de participant 
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-white transition">Tarifs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Support</a></li>
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">CGU</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Evenia - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;