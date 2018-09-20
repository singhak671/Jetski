var userSchema = require("../models/userModel");
const eventSchema = require('../models/eventManagementModel')
const Response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage');
const message = require('../common_functions/message');
const bcrypt = require('bcryptjs');
const config = require('../config/config')();
const cloudinary = require('../common_functions/uploadImage');
const jwt = require('jsonwebtoken');
const notification = require('../common_functions/notification');
const Noti = require('../models/notificationModel');
var waterfall = require("async-waterfall");
const async = require('async');
const keySecret = 'sk_test_7OyC78h4UYqhcEiH2N2vcX9O';//client
const stripe = require("stripe")(keySecret);


module.exports = {

    //.................................................................Signup API .............................................................//
    "signup": function (req, res) {
        if (!req.body.email || !req.body.password)
            Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "email_id and password are required**");
        else {
            userSchema.findOne({ $or: [{ status: { $in: ["ACTIVE", "BLOCK"] } }], email: req.body.email }, async (err, result) => {
                if (err)
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                else if (result)
                    Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with ${result.userType} account`);
                else {     

                    stripe.accounts.create({
                        type: 'custom',
                        country: 'US',
                        email: req.body.email
                    }, function (err, account) {
                        if (err) {
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "errr in strip")
                        }
                        else {

                            req.body.stripeAccountId = account.id 

                            var token = req.body.stripe_token; 
                            var stripe_acc = account.id
                            try {
                                stripe.accounts.createExternalAccount(
                                    stripe_acc,
                                    { external_account: token }

                                )
                            } catch (err) {
                                console.log(`Error of external account ${JSON.stringify(err)}`)
                            }
                            var retVal = "";
                            const saltRounds = 10;
                            retVal = req.body.password;
                            bcrypt.genSalt(saltRounds, (err, salt) => {
                                bcrypt.hash(retVal, salt, (error, hash) => {
                                    req.body.password = hash;
                                    let user = new userSchema(req.body);
                                    user.save({ lean: true }).then((result) => {
                                        if (error) {
                                            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                                        } else {
                                            var result = result.toObject();
                                            delete result.password;
                                            Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "You have successfully signup.", result)
                                            
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
  
    //...................................................................Login API............................................................. //
   
   
    "login": (req, res) => {
        let id;
        if (req.body.socialId) {
            obj = {
                socialId: req.body.socialId,
                name: req.body.name,
                deviceToken: req.body.deviceToken,
                profilePic: req.body.profilePic,
                deviceType: req.body.deviceType,
                email: req.body.email,
                status: "ACTIVE",
                userType: "CUSTOMER"
            };

            var userSchemaData = new userSchema(obj);
            userSchema.findOne({ $or: [{ status: { $in: ["ACTIVE", "BLOCK"] } }], email: req.body.email }, async (resultErr_1, resultData) => {
                if (resultErr_1)
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                else if (resultData) {
                    if (!resultData.socialId && req.body.email) {
                        Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with  ${resultData.userType} account`);
                    }
                    else if (req.body.email && req.body.socialId) {
                        if (resultData.socialId == req.body.socialId) {
                            userSchema.findOneAndUpdate({ socialId: req.body.socialId, status: "ACTIVE" }, req.body, { new: true, select: { "password": 0 } }, (err_1, result) => {
                                if (err_1) {
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                                }
                                else if (result) {

                                    var token = jwt.sign({ _id: (result._id), socialId: req.body.socialId }, config.secret_key);
                                    return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, result, token);
                                }
                            })
                        }
                        else {
                            Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with  ${resultData.userType} account`);
                        }
                    }
                }

                else if (!resultData) {
                    userSchemaData.save((err, success) => {
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                        if (!success)
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Data doesn't save")
                        else {
                            var token = jwt.sign({ _id: (success._id), socialId: req.body.socialId }, config.secret_key);
                            userSchema.findOne({ _id: success._id, status: "ACTIVE" }, { name: 1 }, (err_, success1) => {
                                if (err_) {
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);

                                }

                                if (!success) {
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Data doesn't exist")
                                }
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
                if (err)
                    return Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR')
                if (!result) {
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
                            var token = jwt.sign({ _id: result._id, email: result.email, password: result.password }, config.secret_key);
                            userSchema.findByIdAndUpdate({ _id: result._id }, { $set: { deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } }, (err2, res3) => {
                                if (err2) {
                                }
                                else if (res3) {
                                }
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

    //............................................................userDetail API......................................................................//
    "viewUserDetail": (req, res) => {
        userSchema.findOne({ _id: req.headers._id, status: "ACTIVE" }, { password: 0 }, (error, result) => {
            if (error)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            if (!result)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
            return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
        })
    },

    //..............................................get detail (Customer and Business)API for Admin panel............................................ //
    "viewDetail": (req, res) => {
        userSchema.findOne({ _id: req.params._id }, { password: 0 }, (error, result) => {
            if (error)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (!result) {
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
            } else {

                return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
            }
        })
    },

    //...........................................................editUser API........................................................................ //

    "editUser": (req, res) => {
        userSchema.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, success) => {
            if (err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            if (!success)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
            //success part
            cloudinary.uploadImage(req.body.profilePic, (err, result) => {
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


    //......................................................editCustomer API for AdminPanel.......................................................... //
  
    "edit": (req, res) => {
      
        userSchema.findOne({ _id: req.body._id }, (err, success) => {
            if (err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            if (!success)
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
            //success part
            cloudinary.uploadImage(req.body.profilePic, (err, result) => {
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

    //.............................................delete User Api for both(Customer & Business)......................................................//
  
    "deleteUser": (req, res) => {
        userSchema.findById({ _id: req.body._id }).exec((error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (!result)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else {
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


    // .......................................Block/Active User Api for both by Admin Panel...........................................................//
    "blockUser": (req, res) => {
        userSchema.findById({ _id: req.body._id }).exec(function (err, data) { 
            if (err) {
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            }
            else if (!data)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else {
                if (data.status == 'ACTIVE') {
                    userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "BLOCK" } }, (error, result) => {
                        if (error) {
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                        }
                        else if (!result)
                            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                        else {
                            eventSchema.update({ userId: req.body._id }, { status: "BLOCK" }, { multi: true }, (err1, success) => {
                                if (err1) {
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                                }
                                else if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is blocked successfully . ", success)
                                }
                            })
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
                                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
                                }
                                else if (!success)
                                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "User is now actived... ", success)
                                }
                            })
                        }
                    })
                }
            }
        })
    },



    //..............................................forgot password API............................................................................//

    "forgotPassword": (req, res) => {
        if (!req.body.email)
            return Response.sendResponseWithData(res, resCode.BAD_REQUEST, "Please provide email");
        else {
            var otp = message.getCode();
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(otp, salt, (error, hash) => {
                    var newvalues = { $set: { password: hash } };
                    userSchema.findOneAndUpdate({ email: req.body.email, status: "ACTIVE" }, newvalues, (err, success) => {
                        if (err)
                            return Response.sendResponseWithoutData(res, resCode.BAD_REQUEST.resMessage.WENT_WRONG);
                        if (!success)
                            return Response.sendResponseWithData(res, resCode.NOT_FOUND, "Email not found");
                        message.sendemail(success.email, "Updated Password for Aqua_Ludus Account", `Dear ${success.name} , \ 
                    Your password is `+ otp, (err, result) => {
                                if (err) {
                                    Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, resMessage.UNAUTHORIZED);
                                }
                                else {
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Password sent successfully.");
                                }
                            });

                    })
                })
            })
        }
    },

    //..............................................................changePassword API.............................................................//

    "changePassword": (req, res) => {
        if (!req.body.oldPassword || !req.headers._id || !req.body.newPassword || !req.body.confirmPassword)
            return Response.sendResponseWithData(res, resCode.BAD_REQUEST, "Please provide all required data.");
        userSchema.findById(req.headers._id, (err, success) => {
            if (err) {
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
            }
            if (!success)
                return Response.sendResponseWithData(res, resCode.NOT_FOUND, "USER NOT EXIST");
            //   //success
            {
                bcrypt.compare(req.body.oldPassword, success.password, (err1, result1) => {
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
    //........................................................Save reviews..........................................................................//
    'postReviews': (req, res) => {
        userSchema.findByIdAndUpdate({ _id: req.body._id, userType: "CUSTOMER" }, { $set: { reviews: req.body.reviews } }, { new: true }, (err, result) => {
            if (err)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else {
                notification.single_notification(result.deviceToken, 'Review Posted!!', 'You are successfully placed your review regarding app', result.businessManId, result._id, result.profilePic, result.name)
                return Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, 'Your Review  is updated Successfully.');
            }
        }
        )
    },
    //..............................................................View Reviews....................................................................//
    'viewReviews': (req, res) => {
        userSchema.find({ userType: "CUSTOMER", "reviews": { $exists: true, $ne: null } }, { reviews: 1, name: 1, address: 1, profilePic: 1 }).sort({ updatedAt: -1 }).limit(5).exec((err, result) => {
            if (err)
                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else {
                Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Customer's reviews list found successfully", result);
            }
        })
    },

    //.......................................................Search filter API for Admin..............................................................//

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
            obj = { status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType }
        }
        else if (req.body.userType && req.body.search) {
            obj = {
                $or: [{ status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType, name: value }, { status: { $in: ["ACTIVE", "BLOCK"] }, userType: req.body.userType, email: value }]
            }
        }
        else {
            obj = {
                $or: [{ $and: [{ userType: req.body.userType }, { name: value }] }, { $and: [{ userType: req.body.userType }, { email: value }] }]
            }
        }
        let options = {
            page: req.body.pageNumber || 1,
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
            Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, data.docs, { total: data.total, limit: data.limit, currentPage: data.page, totalPage: data.pages });

        })
    },

 //......................................................................logOut API..................................................................//
  
 'logOut': (req, res) => {       
        userSchema.update({ _id: req.headers._id }, { $set: { jwtToken: '', deviceToken: '' } }, (error, result) => {
            if (error) {
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
            } else if (!result) {
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            }
            else {
                Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "User logged out successfully.")
            }
        })     
    },
}