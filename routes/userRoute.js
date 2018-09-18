const router = require('express').Router();
const User= require('../webservices/userController');
const authHandler = require('../middleware/auth_handler');

router.post('/signup',User.signup);
router.post('/login',User.login);
router.get('/viewUserDetail',authHandler.verifyToken,User.viewUserDetail);
router.get('/viewDetail/:_id',authHandler.verifyToken,User.viewDetail);//by Admin panel
router.post('/editUser',authHandler.verifyToken,User.editUser);
router.post('/edit',authHandler.verifyToken,User.edit)//by Admin panel
router.post('/forgotPassword',User.forgotPassword);
router.post('/changePassword',authHandler.verifyToken, User.changePassword);
router.post('/deleteUser',authHandler.verifyToken,User.deleteUser);//by Admin panel
router.post('/blockUser',authHandler.verifyToken,User.blockUser);//by Admin panel
router.post('/searchCustomerFilter',authHandler.verifyToken,User.searchCustomerFilter);//by Admin panel
router.post('/postReviews',authHandler.verifyToken,User.postReviews);
router.get('/viewReviews',User.viewReviews);
router.get('/logOut',authHandler.verifyToken,User.logOut);

module.exports = router;








