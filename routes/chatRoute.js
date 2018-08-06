const router = require('express').Router();
const chat= require('../webservices/chatController');
//const authHandler = require('../middleware/auth_handler');

router.post('/chatAPI',chat.chatAPI);
module.exports=router;