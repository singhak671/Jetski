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
var waterfall=require("async-waterfall");

module.exports = {

    //.................................................................Signup API ..........................................................................//
    "signup": function(req, res){
     //   console.log("signup==>>",req.body);
        if(!req.body.email || !req.body.password)  
            Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "email_id and password are required**");
       else{
        userSchema.findOne({email:req.body.email,status:"ACTIVE"},(err,result)=>{
            if(err)
            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
        else if(result)
            Response.sendResponseWithoutData(res, resCode.ALREADY_EXIST, resMessage.ALL_READY_EXIST_EMAIL);
        else{
            var retVal = "";
                const saltRounds = 10;
                retVal = req.body.password;


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
    "login":(req,res)=>{
        //console.log("login request====++",req.body)
        let id;
    
        if(req.body.socialId){
            obj = {
                "socialId":req.body.socialId,
                name:req.body.name,                          
                email:req.body.email,
                status:"ACTIVE",
                userType:"CUSTOMER"};
                var userSchemaData= new userSchema(obj);
                userSchema.findOne({email: req.body.email,status:"ACTIVE"},{name:1},(err_1,result)=>{
                    if(err_1){
                         return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                    }
                    if(result)
                    { console.log("res>>>>>.",result);
                        var token = jwt.sign({_id:(result._id),socialId:req.body.socialId},config.secret_key);                   
                     return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS,result,token);

                }
                   
             if(!result)
             {
                    userSchemaData.save((err,success)=>{
                        if(err)
                            return   Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
                        if(!success)
                        return   Response.sendResponseWithoutData(res, resCode.WENT_WRONG,"Data doesn't save")
                        else{
                            var token = jwt.sign({_id:(success._id),socialId:req.body.socialId},config.secret_key);
                            userSchema.findByIdAndUpdate(success._id,{new:true},(err_,success1)=>{
                                if(err_)
                                return   Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
        
                                if(!success)
                                return   Response.sendResponseWithoutData(res, resCode.WENT_WRONG,"Data doesn't exist")
                                
                              return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.LOGIN_SUCCESS,success1,token);
        
                            })
                        }
                    
        
                    })
                }
           })
        
        }  
        else{
            if(!req.body.email || !req.body.password)
            return  Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please provide email_id & password"); 
         userSchema.findOne({email: req.body.email,status:"ACTIVE",userType:req.body.userType},{email:0,address:0,mobile_no:0},{lean:true},(err,result)=>{
                console.log("Login success==>>",result)
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
        }
    },
    
    
 //..................................................................userDetail API............................................................................... //
   "viewUserDetail": (req, res) => {
    console.log("requested id is"+req.headers._id);
    userSchema.findOne({_id:req.headers._id,status: "ACTIVE"},{password:0},(error,result)=>{
        if(error)
          return  Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
        if(!result)
          return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND, result)
        console.log("SIGNUP RESULT-------->",result)
          return  Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result)
       })
    },

 //................................................................editUser API.................................................................................. //

 "editUser": (req, res) => {
          console.log((req.body));
            if(req.body._id!=req.headers._id){
            console.log("headerId and UserId not match")
            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Provided UserData not match.");
            }
    userSchema.findOne({_id:req.body._id,status: "ACTIVE"},(err,success)=>{
        if(err)
            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
         if(!success)
            return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
       //success part
            cloudinary.uploadImage(req.body.profilePic, (err, result) => {
              console.log("login result On controller",result,"err",err);
                if(err)
                    return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
                if(result)    
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
    else{
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
                    
                    message.sendemail(success.email, "Updated Password for Aqua_Ludus Account", `Dear ${success.name} , \ 
                    Your password is `+otp, (err,result)=>{
                            if(err)
                        {
                            console.log("Email not sent")
                            Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, resMessage.UNAUTHORIZED);
                        }
                        else{
                            console.log("Email for forgotPassword sent successfully");
                            Response.sendResponseWithData(res,resCode.EVERYTHING_IS_OK,"Password sent successfully.");
                        }                    
                    });
    
                })
            })
        })
      }
   },

//......................................................................changePassword API............................................................................//

 "changePassword":(req,res)=>{
 if(!req.body.oldPassword || !req.headers._id || !req.body.newPassword || !req.body.confirmPassword)
 return Response.sendResponseWithData(res,resCode.BAD_REQUEST,"Please provide all required data.");
   
     console.log("Change password request "+JSON.stringify(req.body))
         userSchema.findById(req.headers._id,(err,success)=>{
            if (err)
            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, 'INTERNAL SERVER ERROR')
         if (!success)
        return Response.sendResponseWithData(res,resCode.NOT_FOUND,"USER_NOT_EXIST");
       //success
          {
            bcrypt.compare(req.body.oldPassword, success.password, (err, result) => {
                if (result) {
                    if (req.body.newPassword != req.body.confirmPassword) {
                        return  Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "NEW_CONFIRM_INCORRECT");
                    }
                    let salt = bcrypt.genSaltSync(10);
                    success.password = bcrypt.hashSync(req.body.newPassword, salt)
                    success.save((err, success) => {
                        if (err) {
                            return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, 'INTERNAL SERVER ERROR')
                        } else {

                            Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, "PASSWORD_UPDATE_SUCCESS ")

                        }
                    })
                } else {
                    return  Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "OLD_PASSWORD_INCORRECT");
                }
            })
           }
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
 

}


            



