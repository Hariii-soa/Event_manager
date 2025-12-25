import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les événements publics
  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const fetchPublicEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/participant/evenements-disponibles');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }

      const data = await response.json();
      console.log('✅ Événements publics récupérés:', data.length);
      setEvents(data);
    } catch (error) {
      console.error('❌ Erreur fetchPublicEvents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Déterminer le badge selon la date
  const getBadgeForEvent = (dateEvenement) => {
    const eventDate = new Date(dateEvenement);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Terminé';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays <= 7) return 'Cette semaine';
    if (diffDays <= 30) return 'Ce mois-ci';
    return 'À venir';
  };

  // Construire les slides
  const slides = [
    {
      id: 'intro',
      badge: 'Management',
      title: "Gestion d'événements",
      description: "Organisez et gérez tous vos événements en toute simplicité",
      image: '/management.png',
      isIntro: true
    },
    ...events.map(event => ({
      id: event.id_evenement,
      badge: getBadgeForEvent(event.date_evenement),
      title: event.titre,
      description: event.description || 'Aucune description disponible',
      date: formatDate(event.date_evenement),
      location: event.lieu,
      participants: {
        current: event.nombre_participants_actuels || 0,
        total: event.nombre_places
      },
      image: event.image_url ? `http://localhost:3000${event.image_url}` : null,
      isIntro: false
    }))
  ];

  const currentSlideData = slides[currentSlide] || slides[0];
  const isFirstSlide = currentSlideData?.isIntro === true;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-block animate-spin rounded-full h-50 w-50 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Container centré avec max-width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* En-tête */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Soyez les bienvenues sur Evenia!
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Gérez vos événements en toute simplicité depuis un seul endroit.
          </p>
        </div>

        {/* Carrousel */}
        <div className="relative mb-12 sm:mb-16">
          <div className="relative h-[700px] sm:h-[700px] lg:h-[700px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
            {currentSlideData.image ? (
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-pink-100 to-blue-100 flex items-center justify-center">
                <span className="material-icons text-9xl text-gray-400">event</span>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

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
                </>
              ) : (
                <>
                  <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-4">
                    {currentSlideData.badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3 max-w-3xl">
                    {currentSlideData.title}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 max-w-2xl opacity-90">
                    {currentSlideData.description}
                  </p>
                  <p className="text-xs sm:text-sm opacity-70 mb-3 sm:mb-6">
                    {currentSlideData.date} • {currentSlideData.location}
                  </p>

                  {currentSlideData.participants && (
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
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
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

            {/* Dots */}
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
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Découvrez les possibilités d'Evenia
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            De la planification de mariages aux conférences professionnelles, en passant par les anniversaires et ateliers, notre plateforme vous accompagne dans tous vos événements.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            Utilisez le dashboard à gauche pour commencer.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-200 bg-white">
        <p className="text-center text-xs sm:text-sm text-gray-500">
          © 2025 Evenia - Votre plateforme de gestion d'événements
        </p>
      </footer>
    </div>
  );
};

export default HomePage;