const router = require('express').Router();
const chat= require('../webservices/chatController');
const authHandler = require('../middleware/auth_handler');

router.post('/chatAPI',chat.chatAPI);
router.post('/chatHistory',authHandler.verifyToken,chat.chatHistory);


module.exports=router;

