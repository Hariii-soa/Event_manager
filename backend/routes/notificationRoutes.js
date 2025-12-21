// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// Import du controller
const {
  getNotifications,
  getUnreadNotifications,
  countUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getStats
} = require('../controllers/notificationController');

// Toutes les routes nécessitent authentification
router.use(verifyToken);

// Routes
router.get('/', getNotifications);
router.get('/unread', getUnreadNotifications);
router.get('/count', countUnreadNotifications);
router.get('/stats', getStats);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/all', deleteAllNotifications);

module.exports = router;