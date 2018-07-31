const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
//const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',Business.addEvent);
 router.get('/latestEvents',Business.latestEvents);
  router.get('/allEvent',Business.allEvent);
 router.post('/myAllEvents',Business.myAllEvents);
 router.get('/latestLocation',Business.latestLocation);
 router.get('/eventsPending',Business.eventsPending);
 router.get('/eventsConfirmed',Business.eventsConfirmed);
 router.post('/confirmEventStatus',Business.confirmEventStatus);
 router.post('/rejectEventStatus',Business.rejectEventStatus);
 
 

 //router.post('/bookingEvent',Business.bookingEvent);
 
module.exports = router;
