const router = require('express').Router();
const static = require('../webservices/termsAndPrivacyController');
const authHandler = require('../middleware/auth_handler');

// router.post('/saveStatic', static.saveStatic);
router.post('/updateStatic', static.updateStatic);
router.get('/getStaticContent', static.getStaticContent);

module.exports = router;