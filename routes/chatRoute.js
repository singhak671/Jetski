const router = require('express').Router();
const chat= require('../webservices/chatController');
const authHandler = require('../middleware/auth_handler');

router.post('/chatAPI',chat.chatAPI);
router.post('/chatHistory',chat.chatHistory);

// router.post('/notificationList',chat.notificationList);
// router.get('/unreadCount/:bussinessId',chat.unreadCount)
// router.get('/updateReadStatus/:bussinessId',chat.updateReadStatus)
module.exports=router;

//{
    // "eventId":"5b77b7275168a1e5d0de3be7",
    // "businesssManId":"5b77b6d45168a1e5d0de3be6",
    // "customerId":"5b6da987e4399c1dc331d017",
    // "message" : [
    //         {
                
    //             "senderId" : "5b77b6d45168a1e5d0de3be6",
    //             "message" : "hdshghdghsdghsd"
    //         }
    // ]
    
    // }