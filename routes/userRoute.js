const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User= require('../webservices/userController');
 const authHandler = require('../middleware/auth_handler');




router.post('/signup',User.signup);
router.post('/login',User.login);
router.get('/viewUserDetail',authHandler.verifyToken,User.viewUserDetail);
router.get('/viewDetail/:_id',User.viewDetail);//by Admin panel
router.post('/editUser',authHandler.verifyToken,User.editUser);
router.post('/edit',User.edit)//by Admin panel
router.post('/forgotPassword', User.forgotPassword);
router.post('/changePassword',authHandler.verifyToken, User.changePassword);
router.post('/deleteUser',User.deleteUser);//by Admin panel
router.post('/blockUser',User.blockUser);//by Admin panel
router.get('/getAllCustomer/:pageNumber',User.getAllCustomer);//by Admin panel
router.get('/getAllBusiness/:pageNumber',User.getAllBusiness);//by Admin panel
router.post('/searchCustomerFilter',User.searchCustomerFilter);//by Admin panel

 


module.exports = router;








