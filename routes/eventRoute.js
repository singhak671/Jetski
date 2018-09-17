const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',authHandler.verifyToken,Business.addEvent);
 router.get('/latestEvents',Business.latestEvents);
  router.get('/allEvent',Business.allEvent);
 router.post('/myAllEvents',authHandler.verifyToken,Business.myAllEvents);
 router.get('/eventLocation',authHandler.verifyToken,Business.eventLocation);
 router.post('/locationDetail',authHandler.verifyToken,Business.locationDetail);
 router.post('/myBooking',authHandler.verifyToken,Business.myBooking);
 router.post('/eventsPending',authHandler.verifyToken,Business.eventsPending);
 router.post('/eventsConfirmed',authHandler.verifyToken,Business.eventsConfirmed);
 router.post('/eventsCancelled',authHandler.verifyToken,Business.eventsCancelled);
 router.post('/eventsCompleted',authHandler.verifyToken,Business.eventsCompleted);
 router.post('/confirmEventStatus',authHandler.verifyToken,Business.confirmEventStatus);
 router.post('/rejectEventStatus',authHandler.verifyToken,Business.rejectEventStatus);
 router.post('/bookingEvent',Business.bookingEvent);
 router.post('/booking',Business.booking);
 router.post('/eventDescription',authHandler.verifyToken,Business.eventDescription);
 router.post('/filterEvent',authHandler.verifyToken,Business.filterEvent);
 router.post('/myBookingShow',authHandler.verifyToken,Business.myBookingShow);
 router.post('/filterEventsPending',authHandler.verifyToken,Business.filterEventsPending);
 router.post('/filterEventsConfirm',authHandler.verifyToken,Business.filterEventsConfirm);
 //router.post('/bookingEvent',authHandler.verifyToken,Business.bookingEvent);
 router.post('/addCustomerFeedback',authHandler.verifyToken,Business.addCustomerFeedback);
 router.post('/viewCustomerFeedback',authHandler.verifyToken,Business.viewCustomerFeedback);//////////
 router.post('/myEventFeedback',authHandler.verifyToken,Business.myEventFeedback);/////////
 router.get('/allFeedbackViews',authHandler.verifyToken,Business.allFeedbackViews);/////////
 router.post('/cancelBooking',authHandler.verifyToken,Business.cancelBooking);
 router.post('/getAllEvents/',authHandler.verifyToken,Business.getAllEvents);
 router.post('/transactionManagementFilter',authHandler.verifyToken,Business.transactionManagementFilter);
//  router.post('/searchEventFilter',Business.searchEventFilter);
//  router.post('/getTransactionManagement',Business.getTransactionManagement);
 router.get('/avgBussinessList',Business.avgBussinessList);//////////
module.exports = router;
