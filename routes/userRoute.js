const router = require('express').Router();
//const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('../webservices/userController');
 const authHandler = require('../middleware/auth_handler');



//router.post("/verifyToken",authHandler.verifyToken)
router.post('/signup',User.signup);
router.post('/login',User.login);
router.get('/viewUserDetail/:userId',authHandler.verifyToken,User.viewUserDetail);
router.post('/editUser',authHandler.verifyToken,User.editUser)
router.post('/forgotPassword', User.forgotPassword)
router.post('/changePassword',authHandler.verifyToken, User.changePassword)
router.post('/deleteUser',authHandler.verifyToken,User.deleteUser);
router.get('/getAllCustomer/:pageNumber',authHandler.verifyToken,User.getAllCustomer);;
router.post('/logOut',User.logOut);
//router.post('/myProfileEdit',User.myProfileEdit);


module.exports = router;








