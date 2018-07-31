const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
//const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',Business.addEvent);
 router.get('/latestEvent',Business.latestEvent);
 //router.post('/bookingEvent',Business.bookingEvent);
 
module.exports = router;
