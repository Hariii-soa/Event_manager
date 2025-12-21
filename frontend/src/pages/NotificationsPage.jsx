import React, { useState, useEffect } from 'react';

const NotificationsPage = () => {
  const navigate = (path) => window.location.href = path;
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState(null);

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
      fetchStats();
    }
  }, [userEmail, filter]);

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
      
      const endpoint = filter === 'unread' 
        ? `http://localhost:3000/api/notifications/unread?email=${encodeURIComponent(userEmail)}`
        : `http://localhost:3000/api/notifications?email=${encodeURIComponent(userEmail)}&limit=100`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erreur chargement notifications');

      let data = await response.json();
      
      // Filtrer côté client si nécessaire
      if (filter === 'read') {
        data = data.filter(n => n.lu);
      }

      setNotifications(data);
    } catch (error) {
      console.error('Erreur fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!userEmail) return;

    try {
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:3000/api/notifications/stats?email=${encodeURIComponent(userEmail)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur stats');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
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
      fetchStats();
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
      fetchStats();
    } catch (error) {
      console.error('Erreur mark all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette notification ?')) return;

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
      fetchStats();
    } catch (error) {
      console.error('Erreur delete:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Supprimer TOUTES les notifications ? Cette action est irréversible.')) return;

    try {
      const token = getToken();
      
      await fetch('http://localhost:3000/api/notifications/all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Erreur delete all:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inscription_confirmee':
        return { emoji: '📋', color: 'bg-blue-100' };
      case 'acceptation':
        return { emoji: '✅', color: 'bg-green-100' };
      case 'refus':
        return { emoji: '❌', color: 'bg-red-100' };
      case 'rappel_evenement':
        return { emoji: '🔔', color: 'bg-yellow-100' };
      default:
        return { emoji: '📬', color: 'bg-gray-100' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r bg-blue-200 text-blue-800 text-black px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-800 hover:text-white mb-4 transition"
          >
            <span className="material-icons">arrow_back</span>
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="material-icons text-4xl">notifications</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Notifications</h1>
              <p className="text-blue-800">Toutes vos notifications en un seul endroit</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-800 text-sm mb-1">Total</p>
                <p className="text-2xl font-bold">{stats.total_notifications}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-800 text-sm mb-1">Non lues</p>
                <p className="text-2xl font-bold">{stats.non_lues}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className=" text-blue-800 text-sm mb-1">Lues</p>
                <p className="text-2xl font-bold">{stats.lues}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-800 text-sm mb-1">Dernière</p>
                <p className="text-sm font-medium">
                  {stats.derniere_notification 
                    ? new Date(stats.derniere_notification).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                    : '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions et filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filtres */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === 'unread'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Non lues
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === 'read'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lues
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {stats && stats.non_lues > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <span className="material-icons text-sm">done_all</span>
                  Tout marquer comme lu
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <span className="material-icons text-sm">delete_sweep</span>
                  Tout supprimer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Liste des notifications */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <span className="material-icons animate-spin text-4xl text-blue-500">refresh</span>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <span className="material-icons text-6xl text-gray-300 mb-4">notifications_none</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'Vous avez tout lu !' 
                : 'Vous n\'avez aucune notification pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const icon = getNotificationIcon(notif.type_notification);
              return (
                <div
                  key={notif.id_notification}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden ${
                    !notif.lu ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icône */}
                      <div className={`w-12 h-12 ${icon.color} rounded-full flex items-center justify-center flex-shrink-0 text-2xl`}>
                        {icon.emoji}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {notif.titre}
                              {!notif.lu && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDelete(notif.id_notification)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </div>

                        {notif.evenement_titre && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900">
                              📅 {notif.evenement_titre}
                            </p>
                            {notif.code_evenement && (
                              <p className="text-xs text-blue-700 mt-1">
                                Code: {notif.code_evenement}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notif.created_at)}
                          </span>
                          
                          {!notif.lu && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id_notification)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <span className="material-icons text-sm">done</span>
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;