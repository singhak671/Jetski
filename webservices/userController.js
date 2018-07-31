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
// var waterfall = require("async-waterfall");

module.exports = {

    //.................................................................Signup API ..........................................................................//
    "signup": function (req, res) {
        //   console.log("signup==>>",req.body);
        if (!req.body.email || !req.body.password)
            Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "email_id and password are required**");
        else {
            userSchema.findOne({ email: req.body.email, status: "ACTIVE" }, (err, result) => {
                if (err)
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                else if (result)
                    Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, `EmailId already exists with ${result.userType} account`);
                else {
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
                                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "You have successfully signup.")
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
    },

    //......................................................................Login API....................................................................... //
    "login": (req, res) => {
        console.log("login request====++",req.body)
        let id;

        if (req.body.socialId) {
            obj = {
                "socialId": req.body.socialId,
                name: req.body.name,
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
                    console.log("res>>>>>.", result);
                    var token = jwt.sign({ _id: (result._id), socialId: req.body.socialId }, config.secret_key);
                    return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, result, token);

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
            userSchema.findOne({ email: req.body.email, status: "ACTIVE", userType: req.body.userType }, { email: 0, address: 0, mobile_no: 0 }, { lean: true }, (err, result) => {
                console.log("Login success==>>", result)
                if (err)
                    return Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, 'INTERNAL SERVER ERROR')
                if (!result) {
                    console.log("i am here", result)
                    return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Please provide valid credentials");
                }
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
                        delete result['password']

                        return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS, result, token)
                    }
                    else
                        return Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "Please enter correct password.")

                })
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
                    return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Your profile uploaded successfully.", final)

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
        userSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { status: "INACTIVE" } }, { new: true }, (error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (!result)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
            else
                Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "User is successfully deleted. ")
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
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
            }
            if (!success)
                return Response.sendResponseWithData(res, resCode.NOT_FOUND, "USER NOT EXIST");
            //   //success
            {
                bcrypt.compare(req.body.oldPassword, success.password, (err, result) => {
                    console.log("err>>>>>>", err, "result of change>>>>", result);
                    if (result) {
                        if (req.body.newPassword != req.body.confirmPassword) {
                            return Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, resMessage.NEW_CONFIRM_INCORRECT);
                        }
                        let salt = bcrypt.genSaltSync(10);
                        success.password = bcrypt.hashSync(req.body.newPassword, salt)
                        success.save((err, success) => {
                            if (err) {
                                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
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
            page: req.params.pageNumber,
            select: 'userType email name status mobile_no address',
            limit: 10,
            sort: { created_At: -1 },
            //password:0,
            lean: false
        }
        userSchema.paginate({ $and: [{ userType: "CUSTOMER" }, { $or: [{ status: "ACTIVE" }, { status: "BLOCK" }] }] }, options, (error, result) => {
            if (error)
                Respondatedatese.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
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
        page: req.params.pageNumber,
        select: 'userType email name status businessName gender  country',
        limit: 10,
        sort: { created_At: -1 },
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


    "searchCustomerFilter": (req, res) => {

        var value = new RegExp('^' + req.body.name,"i");
        var value2 = new RegExp('^' + req.body.email,"i");
      console.log("this is active",req.body)
        if (req.body.status== "ACTIVE") {
                userSchema.findOne({ name: value,email:value2,status:'ACTIVE'}).exec(function (err, data) {
                if (err) {
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                } else {
                    console.log("dfgfghfhfgh",data)
                  Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE,data);
                }

            })
        } else if(req.body.status=='INACTIVE'){
            userSchema.findOne({ name: value,status:"INACTIVE"}).exec(function (err_, data1) {
                if (err_) {
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                } else {
                    console.log("dfgfghfhfghData123123",data1)
                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK,"Success Inactive All status data found",data1);
                }
            })
        }   else{
            userSchema.findOne({ name: value }).exec(function (err__, data2) {
            if (err__) 
            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
            else {
            Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Success All status data found",data2);
                }
            })
        }
    },
}






