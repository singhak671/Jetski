var userSchema =require("../models/userModel");
const businessSchema= require('../models/businessModel')
var nodemailer=require('nodemailer');
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

module.exports = {

    //.................................................................Signup API ..........................................................................//
    "signup": function(req, res){
     //   console.log("signup==>>",req.body);
        if(!req.body.email || !req.body.password)  
            Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "Plase provide email id and password");
       else{
        userSchema.findOne({email:req.body.email,status:"ACTIVE"},(err,result)=>{
            if(err)
            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
        else if(result)
            Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, resMessage.ALL_READY_EXIST_EMAIL);
        else{

            // if(req.body.userType=='SUPERADMIN'){
            //     userSchema.count({userType:"SUPERADMIN"},(er,re)=>{
            //         req.body.compCount = 10000+re;
            //     })            
            // }
            
            var retVal = "";
                const saltRounds = 10;
                retVal = req.body.password;

                // if(req.body.userType=='STOREADMIN' && req.body.createdBy=='SELF')
                // req.body.isApproved = false;

                bcrypt.genSalt(saltRounds, (err, salt)=> {
                    bcrypt.hash(retVal, salt, (error,hash)=>{
                            req.body.password = hash;
                            let user = new userSchema(req.body);
                            user.save({lean:true}).then((result)=> {
                                console.log("RESULT AFTER SIGNUP USER======>",result);
                                if(error){
                                    console.log(error)
                                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                                }else{
                                    var result = result.toObject();
                                    delete result.password;
                                    Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"SignUp successfully.")
                                    //  message.sendemail(result.email, "Your account for JET_SKI is created.", "Your email id is "+result.email+" and password is"+retVal, (err,success)=>{
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
  "login":(req,res)=>{
        if(!req.body.email || !req.body.password)
        return  Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please Provide Email & Password"); 
        userSchema.findOne({email: req.body.email,status:"ACTIVE",userType:req.body.userType},{email:0,address:0,mobile_no:0},{lean:true},(err,result)=>{
                console.log("Login success==>>",result)
                if(!req.body.userType)
                {
                return  Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please Provide userType");
                }
            if(err)
                return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, 'INTERNAL SERVER ERROR')
            if(!result)            
                return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_MATCH);

            bcrypt.compare(req.body.password, result.password, (err, res1)=>{
                    if(res1)
                    {
                           // console.log("secret key is "+config.secret_key)
                        var token =  jwt.sign({_id:result._id,email:result.email,password:result.password},config.secret_key);
                        // userSchema.findOneAndUpdate({email:req.body.email},{$set:{jwtToken:token}},{select:{"password":0},new:true},(err1,res2)=>{
                        //     if(err1)
                        //     return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, 'INTERNAL SERVER ERROR')
                        //     if(!res2)            
                        //     return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_MATCH);   
                        
                           // })
                           delete result['password']
                      
                           return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS,result,token)
                        }
                    else
                       return Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "Incorrect password.")
                    
                    })
                   
                })
            },
  

   //..................................................................userDetail API............................................................................... //
   "viewUserDetail": (req, res) => {
    console.log("requested id is"+req.params.userId);
    userSchema.findOne({_id:req.params.userId,status: "ACTIVE"},{password:0,jwtToken:0},(error,result)=>{
        if(error)
            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
        else if(!result)
            Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
        else
            Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
       })
    },

//................................................................editUser API.................................................................................. //


// "editUser": (req, res) => {
//     console.log("edit customer request"+JSON.stringify(req.body))
//     userSchema.findOneAndUpdate({_id:req.body._id,status: "ACTIVE"},req.body,{new: true,password:0}).lean().exec((error,result)=>{
//         if(error)
//             Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
//         else if(!result)
//             Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result);
//         else
//         {
//             delete result['password'];
//             Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_UPDATE,result)
//         }
//     })
// },


"editUser": (req, res) => {
    console.log((req.body));
    userSchema.findOne({_id:req.body._id,status: "ACTIVE"},(err,success)=>{
        if(err)
            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
        if(!success)
            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "User Not found");
        cloudinary.uploadImage(req.body.profilePic, (err, result) => {
                console.log("result On controller",result,"err",err);
                if(err || !result)
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
                req.body.profilePic = result;
            userSchema.findByIdAndUpdate({_id:req.body._id,status: "ACTIVE"},req.body,{new:true},(err2,final)=>{
                if (err2 || !final) 
                return   Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "Error Occured.",err2)     
            return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Data Uploaded successfully.",final)

          })
               
        })
                       
                    
     })
        
    
},


 //................................................................forgot password API............................................................................//

 "forgotPassword":(req,res)=>{
    console.log("Forgot password request "+JSON.stringify(req.body))
    if(!req.body.email)
    return Response.sendResponseWithData(res,resCode.BAD_REQUEST,"Please provide email");
    var otp=message.getCode();
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt)=> {
       bcrypt.hash(otp, salt, (error,hash)=>{
           console.log("Replace password is >>",hash);
            var newvalues={$set:{password:hash}};
            console.log("hass>>>>>>",hash);
            userSchema.findOneAndUpdate({email:req.body.email,status: "ACTIVE"},newvalues,(err,success)=>
               {
                   if(err)
                   return Response.sendResponseWithoutData(res,resCode.BAD_REQUEST.resMessage.WENT_WRONG);
                   if(!success)
                   return Response.sendResponseWithData(res,resCode.NOT_FOUND,"Email not found");

                   message.sendemail(success.email, "Updated Password for JET_SKI Account", `${success.name} your password is `+otp, (err,result)=>{
                       if(err)
                       {
                          console.log("Email not sent")
                         Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, resMessage.UNAUTHORIZED);
                       }
                       else{
                          console.log("Email sent successfully");
                           Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"Password sent successfully.");
                       }                    
                  });
   
               })
           })
       })
   },

//......................................................................changePassword API............................................................................//
"changePassword": function(req,res){
       console.log("Change password request "+JSON.stringify(req.body))
       if(!req.body._id || !req.body.password)
       return Response.sendResponseWithData(res,resCode.BAD_REQUEST,"Please provide _id & password");
       var pass_change=req.body.password;
       const saltRounds = 10;
       bcrypt.genSalt(saltRounds, (err, salt)=> {
       bcrypt.hash(pass_change, salt, (error,hash)=>{
           console.log("Change password is >>",hash);
               var newvalues={$set:{password:hash}};
               console.log("hass>>>>>>",hash);
               userSchema.findOneAndUpdate({_id:req.body._id,status: "ACTIVE"},newvalues,(err,success)=>
               {
                   if(err)
                   return Response.sendResponseWithoutData(res,resCode.BAD_REQUEST.resMessage.WENT_WRONG);
                   
                   if(!success){
                   return Response.sendResponseWithData(res,resCode.NOT_FOUND,"User_id not found");
                   }
                   else{
                       console.log("Password Change successfully");
                       Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"Password Change successfully");
                   }   
               })
           })
       })
   },
    //...............................................................deleteUser Api................................................................................//
 "deleteUser": (req, res) => {
    console.log("delete user request"+req.body._id)
    userSchema.findByIdAndUpdate({_id:req.body._id},{$set:{status:"INACTIVE"}},{new:true},(error,result)=>{
        if(error)
            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
        else if(!result)
            Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
        else
            Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "User is successfully deleted. ")
        })
    },

   //.............................................................allCustomerList API.............................................................................. //
   'getAllCustomer': (req, res) => {
    //console.log("get al customer")
   // var query = {};
    let options = {
        page:req.params.pageNumber,
        select:   'userType email name status',
        limit:10,
        sort:{created_At:-1},
        //password:0,
        lean: false
    }
    userSchema.paginate({$and:[{userType:("CUSTOMER","BUSINESS")},{status:"ACTIVE"}]}, options, (error,result)=> {
        if(error)
            Respondatedatese.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
        else if(result.docs.length==0)
           Response.sendResponseWithData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
        else
        {
            console.log("result is"+JSON.stringify(result))
            result.docs.map(x => delete x['password'])
            Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result.docs,{total:result.total,limit:result.limit,currentPage:result.page,totalPage:result.pages});
        }
    })
 },
         
 



 //=====================================================Add Customer Feedback Api========================================================================================//
 "addCustomerFeedback": (req, res) => {
        if (!req.body._id)
            Response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, resMessage.REQUIRED_DATA)
        else {
            var feedback = new Feedback(req.body)
            userSchema.findOne({ _id: req.body._id, status: "ACTIVE" }, (err, result) => {
                if (err)
                    Response.sendResponseWithData(res, resCode.SOMETHING_WENT_WRONG, "Error Occured !!!!", err)
                else if (!result)
                    Response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, "No result !!!!")
                else {
                      feedback.save((err_, result_) => {
                        if (err_)
                            Response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, "Error Occured !!!!")
                        else if (result_)
                            Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "Feedback is successfully send.")
                        else
                            Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Something went wrong....")
                    })
                }
            })
        }
    },
 //=======================================================View Customer Feedback Api====================================================================================
 "viewCustomerFeedback": (req, res) => {
        Feedback.find({}, { name:1, email:1, _id:1 }, (error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
            else if (result.length == 0)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "No data found...")
            else
                Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
        })
    },

 //=======================================================LogOut Api====================================================================================

    'logOut': (req,res) => {
        console.log("req for logout is "+JSON.stringify(req.body))
        if(!req.body)
            Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please give userId.")
        else{
            userSchema.update({_id:req.body.userId},{$set:{jwtToken:''}},(error,result)=>{
                if(error){
                    console.log("error of logout "+JSON.stringify(error))
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                }else if(!result){
                    Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
                }
                else{
                    console.log("result of logout "+JSON.stringify(result))
                    Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "User logged out successfully.")
                }
            })
        }
    }  

}


            



