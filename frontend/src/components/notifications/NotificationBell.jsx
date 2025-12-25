import React, { useState, useEffect } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserEmail(user.email || '');
    } catch (error) {
      console.error('Erreur récupération user:', error);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchNotifications();
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userEmail]);

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur token:', error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    if (!userEmail) return;

    try {
      setIsLoading(true);
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:3000/api/notifications?email=${encodeURIComponent(userEmail)}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur chargement notifications');

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userEmail) return;

    try {
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:3000/api/notifications/count?email=${encodeURIComponent(userEmail)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur comptage notifications');

      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Erreur count notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = getToken();
      
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Erreur mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = getToken();
      
      await fetch('http://localhost:3000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Erreur mark all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      
      await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Erreur delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inscription_confirmee':
        return '📋';
      case 'acceptation':
        return '✅';
      case 'refus':
        return '❌';
      case 'rappel_evenement':
        return '🔔';
      default:
        return '📬';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleViewAll = () => {
    window.location.href = '/dashboard/notifications';
  };

  return (
    <div className="relative">
      {/* Bouton cloche - Responsive */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <span className="material-icons text-gray-700 text-xl sm:text-2xl">notifications</span>
        
        {/* Badge compteur - Responsive */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown - Responsive */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel notifications - Responsive */}
          <div className="absolute right-0 mt-2 w-screen max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] sm:max-h-[600px] flex flex-col">
            {/* Header - Responsive */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Notifications</h3>
                <p className="text-xs text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  Tout marquer
                </button>
              )}
            </div>

            {/* Liste notifications - Responsive */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="p-6 sm:p-8 text-center">
                  <span className="material-icons animate-spin text-2xl text-gray-400">refresh</span>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <span className="material-icons text-3xl sm:text-4xl text-gray-300 mb-2">notifications_none</span>
                  <p className="text-xs sm:text-sm text-gray-500">Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id_notification}
                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notif.lu ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* Icône - Responsive */}
                      <div className="text-xl sm:text-2xl shrink-0">
                        {getNotificationIcon(notif.type_notification)}
                      </div>

                      {/* Contenu - Responsive */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">
                            {notif.titre}
                            {!notif.lu && (
                              <span className="ml-2 inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </h4>
                          <button
                            onClick={() => handleDelete(notif.id_notification)}
                            className="text-gray-400 hover:text-red-500 transition shrink-0"
                          >
                            <span className="material-icons text-sm">close</span>
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {notif.message}
                        </p>

                        {notif.evenement_titre && (
                          <p className="text-xs text-blue-600 font-medium mb-2 line-clamp-1">
                            📅 {notif.evenement_titre}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatDate(notif.created_at)}
                          </span>
                          
                          {!notif.lu && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id_notification)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Marquer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer - Responsive */}
            {notifications.length > 0 && (
              <div className="p-2 sm:p-3 border-t border-gray-200 text-center bg-gray-50">
                <button
                  onClick={handleViewAll}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  Voir toutes les notifications →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;