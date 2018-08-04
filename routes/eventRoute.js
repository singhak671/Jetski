const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
//const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',Business.addEvent);
 router.get('/latestEvents',Business.latestEvents);
  router.post('/allEvent',Business.allEvent);
 router.post('/myAllEvents',Business.myAllEvents);
 router.get('/eventLocation',Business.eventLocation);
 router.post('/locationDetail',Business.locationDetail);
 router.post('/myBooking',Business.myBooking);
 router.post('/eventsPending',Business.eventsPending);
 router.post('/eventBookNow',Business.eventBookNow);
 router.post('/eventsConfirmed',Business.eventsConfirmed);
 router.post('/confirmEventStatus',Business.confirmEventStatus);
 router.post('/rejectEventStatus',Business.confirmEventStatus);
 router.post('/bookingEvent',Business.bookingEvent);
 router.post('/booking',Business.booking);
 router.post('/eventDescription',Business.eventDescription);
 router.post('/filterEvent',Business.filterEvent);

 //router.post('/bookingEvent',Business.bookingEvent);
 
module.exports = router;
