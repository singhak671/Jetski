const router = require('express').Router();
const notification = require('../webservices/notificationController');
const authHandler = require('../middleware/auth_handler');

 router.post('/customerNotification',authHandler.verifyToken,notification.customerNotification);
router.post('/notificationList',authHandler.verifyToken,notification.notificationList);
router.get('/unreadCount/:bussinessId',authHandler.verifyToken,notification.unreadCount)
router.get('/updateReadStatus/:bussinessId',authHandler.verifyToken,notification.updateReadStatus)

module.exports = router;
