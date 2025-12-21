// controllers/notificationController.js
const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const { email } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    console.log('📋 Récupération notifications pour:', email);
    const notifications = await Notification.findByEmail(email, limit);
    
    console.log('✅ Notifications trouvées:', notifications.length);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('❌ Erreur getNotifications:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des notifications' 
    });
  }
};

const getUnreadNotifications = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    console.log('📋 Récupération notifications non lues pour:', email);
    const notifications = await Notification.findUnreadByEmail(email);
    
    console.log('✅ Notifications non lues:', notifications.length);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('❌ Erreur getUnreadNotifications:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des notifications non lues' 
    });
  }
};

const countUnreadNotifications = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const count = await Notification.countUnreadByEmail(email);
    res.status(200).json({ count });
  } catch (error) {
    console.error('❌ Erreur countUnreadNotifications:', error);
    res.status(500).json({ 
      error: 'Erreur lors du comptage des notifications' 
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('✅ Marquage notification comme lue:', id);
    const notification = await Notification.markAsRead(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    console.log('✅ Notification marquée comme lue');
    res.status(200).json({ 
      message: 'Notification marquée comme lue',
      notification 
    });
  } catch (error) {
    console.error('❌ Erreur markAsRead:', error);
    res.status(500).json({ 
      error: 'Erreur lors du marquage de la notification' 
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    console.log('✅ Marquage toutes notifications comme lues pour:', email);
    const notifications = await Notification.markAllAsReadByEmail(email);
    
    console.log('✅ Toutes les notifications marquées comme lues:', notifications.length);
    res.status(200).json({ 
      message: 'Toutes les notifications ont été marquées comme lues',
      count: notifications.length
    });
  } catch (error) {
    console.error('❌ Erreur markAllAsRead:', error);
    res.status(500).json({ 
      error: 'Erreur lors du marquage des notifications' 
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Suppression notification:', id);
    const notification = await Notification.delete(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    console.log('✅ Notification supprimée');
    res.status(200).json({ 
      message: 'Notification supprimée avec succès' 
    });
  } catch (error) {
    console.error('❌ Erreur deleteNotification:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de la notification' 
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    console.log('🗑️ Suppression toutes notifications pour:', email);
    const notifications = await Notification.deleteAllByEmail(email);
    
    console.log('✅ Toutes les notifications supprimées:', notifications.length);
    res.status(200).json({ 
      message: 'Toutes les notifications ont été supprimées',
      count: notifications.length
    });
  } catch (error) {
    console.error('❌ Erreur deleteAllNotifications:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression des notifications' 
    });
  }
};

const getStats = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const stats = await Notification.getStatsByEmail(email);
    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ Erreur getStats:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques' 
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  countUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getStats
};