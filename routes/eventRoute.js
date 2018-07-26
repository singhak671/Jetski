const router = require('express').Router();
const Business= require('../webservices/eventMangementController');
//const authHandler = require('../middleware/auth_handler');

router.post('/addEvent',Business.addEvent);
// router.get('/getAllBusiness/:pageNumber',Business.getAllBusiness);

module.exports = router;
