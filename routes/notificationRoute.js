const router = require('express').Router();
const notification = require('../webservices/notificationController');
//const auth_handler =require('../middleware/auth_handler');


 router.post('/saveToken',notification.saveToken);

 //************** WEB PUSH *********************************/
 //router.post('/subscribe',notification.subscribe);
//************** WEB PUSH *********************************/

//  router.post('/unsubscribe',notification.unsubscribe);
//  router.post('/notify',notification.notify);
 //router.post('/push',notification.push);
router.post('/notificationList',notification.notificationList);
router.get('/unreadCount/:bussinessId',notification.unreadCount)
router.get('/updateReadStatus/:bussinessId',notification.updateReadStatus)

// router.post('/paticularNotificationDetail', auth_handler.auth_func,notification.paticularNotificationDetail);
// router.post('/notificationListForApp',auth_handler.auth_func, notification.notificationListForApp);
// router.get('/unreadCountForApp/:userId',auth_handler.auth_func,notification.unreadCountForApp)
// router.post('/updateReadStatusForApp',auth_handler.auth_func,notification.updateReadStatusForApp)

module.exports = router;