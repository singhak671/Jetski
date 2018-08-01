const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
//const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',Business.addEvent);
 router.get('/latestEvents',Business.latestEvents);
  router.get('/allEvent',Business.allEvent);
 router.post('/myAllEvents',Business.myAllEvents);
 router.get('/eventLocation',Business.eventLocation);
 router.post('/locationDetail',Business.locationDetail);
 router.get('/eventsPending/:pageNumber',Business.eventsPending);
 router.get('/eventsConfirmed/:pageNumber',Business.eventsConfirmed);
 router.post('/confirmEventStatus',Business.confirmEventStatus);
 router.post('/rejectEventStatus',Business.confirmEventStatus);

 
 

 //router.post('/bookingEvent',Business.bookingEvent);
 
module.exports = router;
