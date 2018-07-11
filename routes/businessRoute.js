const router = require('express').Router();
const Business= require('../webservices/businessController');
const authHandler = require('../middleware/auth_handler');

router.post('/addBusiness',Business.addBusiness);

module.exports = router;
