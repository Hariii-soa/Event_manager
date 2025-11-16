// src/pages/HomePage.jsx
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'Management',
      title: "Gestion d'événements",
      description: "Organisez et gérez tous vos événements en toute simplicité",
      image: '/management.png',
    },
    {
      id: 2,
      title: 'Conférence Tech 2024',
      code: 'Code: EVT001',
      description: 'Une conférence sur les dernières technologies...',
      date: '15 décembre 2024',
      location: 'Centre de Conférences, Paris',
      participants: { current: 95, total: 150 },
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    },
    {
      id: 3,
      title: 'Atelier Design UX/UI',
      code: 'Code: EVT002',
      description: 'Un atelier pratique pour apprendre...',
      date: '30 novembre 2024',
      location: 'Studio Créatif, Lyon',
      participants: { current: 25, total: 30 },
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    },
  ];

  // Sécurité : si slide inexistant → fallback
  const currentSlideData = slides[currentSlide] || slides[0];
  const isFirstSlide = currentSlide === 0;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 lg:ml-[20vw] bg-white pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Soyez les bienvenues sur Evenia!
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Gérez vos événements en toute simplicité depuis un seul endroit.
            </p>
          </div>

          {/* Carrousel */}
          <div className="relative max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
              {/* Protection contre image undefined */}
              {currentSlideData.image ? (
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm sm:text-base">Image non disponible</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 text-white">
                {isFirstSlide ? (
                  <>
                    <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-4">
                      {currentSlideData.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 max-w-3xl">
                      {currentSlideData.title}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-8 max-w-2xl opacity-90">
                      {currentSlideData.description}
                    </p>
                    <button className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg lg:rounded-xl transition text-sm sm:text-base">
                      Découvrez maintenant
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 max-w-3xl">
                      {currentSlideData.title}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80 mb-2 sm:mb-3">{currentSlideData.code}</p>
                    <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 max-w-2xl opacity-90">
                      {currentSlideData.description}
                    </p>
                    <p className="text-xs sm:text-sm opacity-70 mb-3 sm:mb-6">
                      {currentSlideData.date} • {currentSlideData.location}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6 max-w-md">
                      <div className="flex-1 h-1.5 sm:h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full transition-all"
                          style={{
                            width: `${(currentSlideData.participants.current / currentSlideData.participants.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm whitespace-nowrap opacity-80">
                        {currentSlideData.participants.current}/{currentSlideData.participants.total} participants
                      </span>
                    </div>

                    <button className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg lg:rounded-xl transition text-sm sm:text-base">
                      Voir les détails
                    </button>
                  </>
                )}
              </div>

              {/* Navigation - Boutons précédent/suivant */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition"
              >
                →
              </button>

              {/* Dots - Indicateurs de slides */}
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section finale */}
          <div className="text-center max-w-4xl mx-auto pb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Découvrez les possibilités d'Evenia
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto px-4">
              De la planification de mariages aux conférences professionnelles, en passant par les anniversaires et ateliers, notre plateforme vous accompagne dans tous vos événements.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
              Utilisez le dashboard à gauche pour commencer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 sm:py-8 mt-12 sm:mt-16 lg:mt-20 border-t border-gray-200 bg-white">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © 2025 Evenia - Votre plateforme de gestion d'événements
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;