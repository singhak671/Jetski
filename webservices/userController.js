var userSchema = require("../models/userModel");
const eventSchema = require('../models/eventManagementModel')
var nodemailer = require('nodemailer');
const Response = require('../common_functions/response_handler');
const imageUpload = require('../common_functions/uploadImage');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage');
const message = require('../common_functions/message');
const bcrypt = require('bcryptjs');
const config = require('../config/config')();
const cloudinary = require('../common_functions/uploadImage');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
var mongoosePaginate = require('mongoose-paginate');
const notification = require('../common_functions/notification');
const Noti = require('../models/notificationModel');
// var waterfall = require("async-waterfall");
const async = require('async');
// const keySecret = 'sk_test_7OyC78h4UYqhcEiH2N2vcX9O';//client
const keySecret = 'sk_test_RnCHCs3r4NmdEJ1Ex9nLfME5';//avanish

const stripe = require("stripe")(keySecret);
const keyPublishable = 'pk_test_qd08fVES1IsBAD3CZEKs00ng';
//  const keySecret = 'sk_test_c1fuFQmWKd4OZeCThFOtLFuY';   //pramod
//  const keySecret = ' sk_test_If8VjcOB09CxnrxnZiUXeM0Q';////sir secret key
// const stripe = require("stripe")(keySecret);
// const keyPublishable = 'pk_test_NS4RiEEZeWMhQEcxYsEfRH5J';
module.exports = {

    //.................................................................Signup API ..........................................................................//

    // "signup": function (req, res) {
    //     //   console.log("signup==>>",req.body);
    //     if (!req.body.email || !req.body.password)
    //         Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "email_id and password are required**");
    //     else {
    //         userSchema.findOne({ email: req.body.email, status: "ACTIVE" }, (err, result) => {
    //             if (err)
    //                 Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
    //             else if (result)
    //                 Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with ${result.userType} account`);
    //             else {
    //                 var retVal = "";
    //                 const saltRounds = 10;
    //                 retVal = req.body.password;
    //                 bcrypt.genSalt(saltRounds, (err, salt) => {
    //                     bcrypt.hash(retVal, salt, (error, hash) => {
    //                         req.body.password = hash;
    //                         let user = new userSchema(req.body);
    //                         user.save({ lean: true }).then((result) => {
    //                             console.log("RESULT AFTER SIGNUP USER======>", result);
    //                             if (error) {
    //                                 console.log(error)
    //                                 Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
    //                             } else {
    //                                 var result = result.toObject();
    //                                 delete result.password;
    //                                 Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "You have successfully signup.", result)
    //                                 //  message.sendemail(result.email, "Your account for AQUA_LUDUS is created.", "Your email id is "+result.email+" and password is"+retVal, (err,success)=>{
    //                                 //     if(success)
    //                                 //     {
    //                                 //         console.log("emailll",success)
    //                                 //         Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"Signed up successfully.",result)
    //                                 //     }                    
    //                                 //  });
    //                             }
    //                         })
    //                     })
    //                 })
    //             }
    //         })
    //     }
    // },



    "signup": function (req, res) {
        console.log("signup==>>", req.body);

        if (!req.body.email || !req.body.password)
            Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "email_id and password are required**");
        else {
            userSchema.findOne({ $or: [{ status: { $in: ["ACTIVE", "BLOCK"] } }], email: req.body.email }, async (err, result) => {
                // userSchema.findOne( {$or:[{ status:"ACTIVE"}, {status:"BLOCK"}], email:req.body.email } , async (err, result) => {
                if (err)
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                else if (result)
                    Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with ${result.userType} account`);
                else {
                    // stripe.tokens.create({
                    //     card: {
                    //        "number": '378282246310005',
                    //    "exp_month": 12,
                    //       "exp_year": 2019,
                    //        "cvc": '123'
                    //      },            
                    // }).then((result) => {
                    //     console.log('token==>>>', result);
                    //     if (result) {
                    //         var token = 'result.id'; // Using Express //////tok_visa
                    //         stripe.accounts.create({type: "custom", account_token: token, })
                    //             .then(function (acct) {
                    //                 console.log('acct==>>>', acct.id);
                    //                 // asynchronously called
                    //             });
                    //     }
                    // }); 
                    stripe.accounts.create({
                        type: 'custom',
                        country: 'US',
                        email: req.body.email
                    }, function (err, account) {
                        // asynchronously called
                        if (err) {
                            console.log('err==>>>', err)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "errr in strip")
                        }
                        else {
                            console.log(account.id)
                            req.body.stripeAccountId = account.id
                            var retVal = "";
                            const saltRounds = 10;
                            retVal = req.body.password;
                            bcrypt.genSalt(saltRounds, (err, salt) => {
                                bcrypt.hash(retVal, salt, (error, hash) => {
                                    req.body.password = hash;
                                    let user = new userSchema(req.body);
                                    user.save({ lean: true }).then((result) => {
                                        console.log("RESULT AFTER SIGNUP USER======>", result);
                                        if (error) {
                                            console.log(error)
                                            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                                        } else {
                                            var result = result.toObject();
                                            delete result.password;
                                            Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "You have successfully signup.", result)
                                            //  message.sendemail(result.email, "Your account for AQUA_LUDUS is created.", "Your email id is "+result.email+" and password is"+retVal, (err,success)=>{
                                            //     if(success)
                                            //     {
                                            //         console.log("emailll",success)
                                            //         Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"Signed up successfully.",result)
                                            //     }                    
                                            //  });
                                        }
                                    })
                                })
                            })
                        }
                    })
                }
            })
        }
    },

    "createStripeAccount": (req, res) => {


        // //     var stripe = require('stripe')('sk_test_...');

        // //     stripe.customers.create(
        // //       { email: 'customer@example.com' },
        // //       function(err, customer) {
        // //         // asynchronously called
        // //         if (err) return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
        // //         else {
        // //             //   console.log(account)
        // //             console.log("businessdsfghj++++++++",customer)
        // //         }
        // //         //   console.log("error++>>>>>",err ,   "success++++++++>>>>>>>>",account)
        // //     });
        // // },


        //     //  console.log('stripe===>>>', stripe);
        //     // return;
        //     //  stripe.accounts.list(
        //     //     // { limit: 3 },
        //     //     function(err, accounts) {
        //     //         console.log('accounts==>>', accounts);
        //     //       // asynchronously called
        //     //     }
        //     // );
        //     stripe.tokens.create({
        //         card: {
        //            "number": '378282246310005',
        //        "exp_month": 12,
        //           "exp_year": 2019,
        //            "cvc": '123'
        //          },            
        //     }).then((result) => {
        //          console.log('token==>>>', result);
        //         if (result) {
        //             var token = result.id;
        //           console.log('token==>>>', result.id);     // Using Express //////tok_visa
        //             stripe.accounts.create({
        //                 country: "US",
        //           type: "custom",
        //                  account_token: token,
        //                  })
        //                 .then(function (acct) {
        //                     console.log('acct==>>>', acct);
        //                     // asynchronously called
        //                 });
        //         }
        //     }); 




        stripe.balance.retrieve(function (err, balance) {
            // asynchronously called
            console.log("show balance>>>>>>>>>>>>>++++++++++", balance)
        });

        // stripe.accounts.create({
        //     type: 'custom',
        //     country: 'US',
        //     email: 'bob@example.com'
        // }, function (err, account) {
        //     // asynchronously called
        //     if (err) return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
        //     else {
        //         //   console.log(account)
        //         console.log("_+)(*&^%$#@!",account.id)
        //     }
        //     //   console.log("error++>>>>>",err ,   "success++++++++>>>>>>>>",account)
        // });
    },






    //......................................................................Login API....................................................................... //
    "login": (req, res) => {
        console.log("login request====++", req.body)
        let id;

        if (req.body.socialId) {
            obj = {
                "socialId": req.body.socialId,
                name: req.body.name,
                deviceToken:req.body.deviceToken,
                deviceType:req.body.deviceType,
                email: req.body.email,
                status: "ACTIVE",
                userType: "CUSTOMER"
            };
            var userSchemaData = new userSchema(obj);
            userSchema.findOne({ email: req.body.email, status: "ACTIVE" }, { name: 1 }, (err_1, result) => {
                if (err_1) {
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                }
                if (result) {

                    cloudinary.uploadImage(req.body.profilePic, (err, result) => {
                        console.log("login result On controller", result, "err", err);
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
                        if (result)
                            req.body.profilePic = result;
                        console.log("res>>>>>.", result);
                        var token = jwt.sign({ _id: (result._id), socialId: req.body.socialId }, config.secret_key);
                        return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, result, token);

                    })
                }

                if (!result) {
                    userSchemaData.save((err, success) => {
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                        if (!success)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Data doesn't save")
                        else {
                            var token = jwt.sign({ _id: (success._id), socialId: req.body.socialId }, config.secret_key);
                            userSchema.findOne({ _id: success._id, status: "ACTIVE" }, { name: 1 }, (err_, success1) => {
                                if (err_)
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);

                                if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Data doesn't exist")

                                return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, success1, token);

                            })
                        }


                    })
                }
            })

        }
        else {
            if (!req.body.email || !req.body.password)
                return Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please provide email_id & password");
            userSchema.findOne({ email: req.body.email, userType: req.body.userType }, { email: 0, address: 0, mobile_no: 0 }, { lean: true }, (err, result) => {
                console.log("Login success==>>", result)
                if (err)
                    return Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR')
                if (!result) {
                    console.log("i am here", result)
                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Please provide valid credentials");
                }
                else if (result.status == 'BLOCK')
                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "User blocked by admin");
                else if (result.status == 'INACTIVE')
                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "User doesn't exist.");
                else {


                    bcrypt.compare(req.body.password, result.password, (err, res1) => {
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR')
                        if (res1) {
                            // console.log("secret key is "+config.secret_key)
                            var token = jwt.sign({ _id: result._id, email: result.email, password: result.password }, config.secret_key);
                            // userSchema.findOneAndUpdate({email:req.body.email},{$set:{jwtToken:token}},{select:{"password":0},new:true},(err1,res2)=>{
                            //     if(err1)
                            //     return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, 'INTERNAL SERVER ERROR')
                            //     if(!res2)            
                            //     return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_MATCH);   

                            // })
                            userSchema.findByIdAndUpdate({_id:result._id}, {$set:{deviceToken:req.body.deviceToken, deviceType: req.body.deviceType}}, (err2, res3)=>{
                                if(err)
                                    console.log("Token not updated.")
                                else
                                    console.log("Token  updated")
                            })
                            delete result['password']

                            return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, result, token)
                        }
                        else
                            return Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "Please enter correct password.")

                    })
                }
            })
        }
    },
    //..................................................................userDetail API............................................................................... //
    "viewUserDetail": (req, res) => {
        console.log("requested id is" + req.headers._id);
        userSchema.findOne({ _id: req.headers._id, status: "ACTIVE" }, { password: 0 }, (error, result) => {
            if (error)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            if (!result)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
            console.log("SIGNUP RESULT-------->", result)
            return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
        })
    },

    //..................................................................get detail (Customer and Business)API for Admin panel............................................................................... //

    "viewDetail": (req, res) => {
        console.log("requested id is" + req.params._id);
        userSchema.findOne({ _id: req.params._id }, { password: 0 }, (error, result) => {
            if (error)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (!result) {
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
            } else {
                console.log("SIGNUP RESULT-------->", result)
                return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
            }
        })
    },

    //................................................................editUser API.................................................................................. //

    "editUser": (req, res) => {
        console.log((req.body));
        // if(req.body._id!=req.headers._id){
        // console.log("headerId and UserId not match")
        // return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Provided UserData not match.");
        // }
        userSchema.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, success) => {
            if (err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            if (!success)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
            //success part
            cloudinary.uploadImage(req.body.profilePic, (err, result) => {
                console.log("login result On controller", result, "err", err);
                if (err)
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
                if (result)
                    req.body.profilePic = result;
                userSchema.findByIdAndUpdate({ _id: req.headers._id, status: "ACTIVE" }, req.body, { new: true, select: { "password": 0 } }, (err2, final) => {
                    if (err2 || !final)
                        return Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
                    return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Your profile updated successfully.", final)

                })

            })



        })

    },


    //................................................................editCustomer API for AdminPanel.................................................................................. //

    "edit": (req, res) => {
        console.log((req.body));
        userSchema.findOne({ _id: req.body._id }, (err, success) => {
            if (err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            if (!success)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
            //success part
            cloudinary.uploadImage(req.body.profilePic, (err, result) => {
                console.log("login result On controller", result, "err", err);
                if (err)
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
                if (result)
                    req.body.profilePic = result;
                userSchema.findByIdAndUpdate({ _id: req.body._id, status: "ACTIVE" }, req.body, { new: true, select: { "password": 0 } }, (err2, final) => {
                    if (err2 || !final)
                        return Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
                    return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Profile updated successfully.", final)
                })
            })
        })
    },

    //...............................................................delete User Api for both................................................................................//

    "deleteUser": (req, res) => {
        console.log("delete user request" + req.body._id)
        userSchema.findById({ _id: req.body._id }).exec((error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (!result)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else
                if (result.status == 'ACTIVE') {
                    userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "INACTIVE" } }, (error, result) => {
                        if (error) {
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                        }
                        else if (!result)
                            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                        else {
                            eventSchema.update({ userId: req.body._id }, { status: "INACTIVE" }, { multi: true }, (err1, success) => {
                                if (err1) {
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                                }
                                else if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is deleted successfully ...", success)
                                }

                            })
                        }
                    })
                }
        })
    },


    // "deleteUser": (req, res) => {
    //     console.log("delete user request" + req.body._id)
    //     userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "INACTIVE" } }, { new: true }, (error, result) => {
    //         if (error)
    //             Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
    //         else if (!result)
    //             Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
    //         else           
    //             Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "User is successfully deleted. ")
    //     })
    // },





    // ...............................................................Block/Active User Api for both by Admin Panel................................................................................//


    "blockUser": (req, res) => {
        userSchema.findById({ _id: req.body._id }).exec(function (err, data) {
            console.log(" iam aID********************>>", req.body._id)
            if (err) {
                console.log("@@@@@@@", err)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            }
            else if (!data)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else {
                if (data.status == 'ACTIVE') {
                    userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "BLOCK" } }, (error, result) => {
                        if (error) {
                            console.log("@@@@@@@", error)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                        }
                        else if (!result)
                            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                        else {
                            eventSchema.update({ userId: req.body._id }, { status: "BLOCK" }, { multi: true }, (err1, success) => {
                                if (err1) {
                                    // console.log("@@@@@@@", error)
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                                }
                                else if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is blocked successfully . ", success)
                                }

                            })

                            //  Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is successfully blocked. ", result)
                        }
                    })
                }
                else if (data.status == 'BLOCK') {
                    userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "ACTIVE" } }, { new: true }, (errr, result1) => {
                        if (errr) {
                            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                        }
                        else if (!result1)
                            Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                        else {
                            eventSchema.update({ userId: req.body._id }, { status: "ACTIVE" }, { multi: true }, (err1, success) => {
                                if (err1) {
                                    // console.log("@@@@@@@", error)
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                                }
                                else if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is now actived... ", success)
                                }

                            })
                            //Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is active successfully . ", result1)
                        }
                    })
                }

            }

        })


    },



    //................................................................forgot password API............................................................................//

    "forgotPassword": (req, res) => {
        console.log("Forgot password request " + JSON.stringify(req.body))
        if (!req.body.email)
            return Response.sendResponseWithData(res, resCode.BAD_REQUEST, "Please provide email");
        else {
            var otp = message.getCode();
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(otp, salt, (error, hash) => {
                    console.log("Replace password is >>", hash);
                    var newvalues = { $set: { password: hash } };
                    console.log("hass>>>>>>", hash);
                    userSchema.findOneAndUpdate({ email: req.body.email, status: "ACTIVE" }, newvalues, (err, success) => {
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.BAD_REQUEST.resMessage.WENT_WRONG);
                        if (!success)
                            return Response.sendResponseWithData(res, resCode.NOT_FOUND, "Email not found");

                        message.sendemail(success.email, "Updated Password for Aqua_Ludus Account", `Dear ${success.name} , \ 
                    Your password is `+ otp, (err, result) => {
                                if (err) {
                                    console.log("Email not sent")
                                    Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, resMessage.UNAUTHORIZED);
                                }
                                else {
                                    console.log("Email for forgotPassword sent successfully");
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Password sent successfully.");
                                }
                            });

                    })
                })
            })
        }
    },

    //......................................................................changePassword API............................................................................//

    "changePassword": (req, res) => {
        if (!req.body.oldPassword || !req.headers._id || !req.body.newPassword || !req.body.confirmPassword)
            return Response.sendResponseWithData(res, resCode.BAD_REQUEST, "Please provide all required data.");

        console.log("Change password request " + JSON.stringify(req.body))
        userSchema.findById(req.headers._id, (err, success) => {
            if (err) {
                console.log("Data of change pass>>>>>>>>>>>>>>", err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            }
            if (!success)
                return Response.sendResponseWithData(res, resCode.NOT_FOUND, "USER NOT EXIST");
            //   //success
            {
                bcrypt.compare(req.body.oldPassword, success.password, (err1, result1) => {
                    console.log("err>>>>>>", err1, "result of change>>>>", result1);
                    if (result1) {
                        if (req.body.newPassword != req.body.confirmPassword) {
                            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "New password and confirmed password should be same");
                        }
                        let salt = bcrypt.genSaltSync(10);
                        let newPassword = bcrypt.hashSync(req.body.newPassword, salt);
                        userSchema.update({ _id: req.headers._id }, { $set: { 'password': newPassword } }, { new: true }).exec((err2, succ2) => {
                            if (err2) {
                                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                            } else {

                                Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, resMessage.PASSWORD_UPDATE_SUCCESS);

                            }

                        })
                    } else {
                        return Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, resMessage.OLD_PASSWORD_INCORRECT);
                    }
                })
            }
        })

    },

    //......................................................................getAllCustomer API for Admin............................................................................//

    'getAllCustomer': (req, res) => {
        //console.log("get al customer")
        // var query = {};
        let options = {
            page: req.params.pageNumber || 1,
            select: 'userType email name status mobile_no  address',
            limit: 10,
            sort: { createdAt: -1 },
            //password:0,
            lean: false
        }
        userSchema.paginate({ $and: [{ userType: "CUSTOMER" }, { $or: [{ status: "ACTIVE" }, { status: "BLOCK" }] }] }, options, (error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                Response.sendResponseWithData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else {
                console.log("result is" + JSON.stringify(result))
                result.docs.map(x => delete x['password'])
                Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
            }
        })
    },

    //......................................................................getAllBusiness API for Admin............................................................................//
    'getAllBusiness': (req, res) => {
        //console.log("get al customer")
        // var query = {};
        let options = {
            page: req.params.pageNumber || 1,
            select: 'userType email name status  businessName gender  country',
            limit: 10,
            sort: { createdAt: -1 },
            //password:0,
            lean: false
        }
        userSchema.paginate({ $and: [{ userType: "BUSINESS" }, { $or: [{ status: "ACTIVE" }, { status: "BLOCK" }] }] }, options, (error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                Response.sendResponseWithData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else {
                console.log("result is" + JSON.stringify(result))
                result.docs.map(x => delete x['password'])
                Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
            }
        })
    },
    //........................................................Save reviews...........................................................
    'postReviews': (req, res) => {
        console.log('Request for postReviews', req.body)
        userSchema.findByIdAndUpdate({ _id: req.body._id, userType: "CUSTOMER" }, { $set: { reviews: req.body.reviews } }, { new: true }, (err, result) => {
            if (err)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else {
                console.log("result of post reviews", result)
                notification.single_notification(result.deviceToken, 'Review Posted!!', 'You are successfully placed your review regarding app', result.businessManId, result._id, result.profilePic, result.name)
                return Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, 'Your Review  is updated Successfully.');
            }
        }
        )
    },
    //...................................................View Reviews..............................................................
    'viewReviews': (req, res) => {
        console.log(`request for view Reviews ${JSON.stringify(req.body)}`)
        // let options = {
        //     page: req.params.pageNumber ,
        //     select:{reviews:1,name:1,address:1},
        //     limit: 10,
        //     //password:0,//,createdAt:1,updatedAt:1
        //     lean: false
        // }
        userSchema.find({ userType: "CUSTOMER", "reviews": { $exists: true, $ne: null } }, { reviews: 1, name: 1, address: 1, profilePic: 1 }).sort({ updatedAt: -1 }).limit(5).exec((err, result) => {
            console.log("result of post reviews", result, err)
            if (err)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else {

                //   return Response.sendResponseWithData(res, resCode.BAD_REQUEST, "Customer's reviews list found successfully",result);
                Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Customer's reviews list found successfully", result);
            }
        })

    },


    "searchCustomerFilter": (req, res) => {

        var value = new RegExp('^' + req.body.search, "i")
        var obj
        if (req.body.search && req.body.status) {
            obj = {
                $or: [{ $and: [{ status: req.body.status }, { userType: req.body.userType }, { name: value }] }, { $and: [{ status: req.body.status }, { userType: req.body.userType }, { email: value }] }]
            }
        }

        else if (!req.body.search && req.body.status) {
            obj = {
                $and: [{ status: req.body.status }, { userType: req.body.userType }]
            }
        }
        else if (req.body.userType && !req.body.status && !req.body.search) {
            // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ")
            obj = { status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType }
            //    {"status":"ACTIVE" || "BLOCK"}
            // $and: [{ name: req.body.search},{email: req.body.search} ,{userType: 'CUSTOMER' }]

        }
        else if (req.body.userType && req.body.search) {
            // console.log("&&&&&&&&&&&&&&&&&&&& ")
            obj = {
                $or: [{ status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType, name: value }, { status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType, email: value }]
            }
        }
        else {
            obj = {
                $or: [{ $and: [{ userType: req.body.userType }, { name: value }] }, { $and: [{ userType: req.body.userType }, { email: value }] }]
                // $and: [{ name: req.body.search},{email: req.body.search} ,{userType: 'CUSTOMER' }]
            }
        }
        let options = {
            page: req.body.pageNumber || 1,
            // select: 'userType email name status businessName gender  country',
            limit: 10,
            sort: { createdAt: -1 },
            select: 'userType email name status mobile_no address country businessName gender',
            lean: false
        }
        userSchema.paginate(obj, options, (err, data) => {
            if (err) {
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
            }
            if (!data) {
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND);
            }
            // console.log("dat", data)
            Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, data.docs, { total: data.total, limit: data.limit, currentPage: data.page, totalPage: data.pages });

        })
    },



}