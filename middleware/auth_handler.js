const jwt = require('jsonwebtoken');
const config = require('../config/config')();
const Response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode')
const resMessage = require('../helper/httpResponseMessage');
const userSchema = require('../models/userModel');
 
const auth = { 
   verifyToken: (req, res, next)=>{
        if(req.headers.token){
            jwt.verify(req.headers.token, config.secret_key, (err,result)=>{
                
                if(err)
                {
                    Response.sendResponseWithoutData(res, 403, "Invalid token provided.")
               }    
                else{
                    userSchema.findOne({_id:req.headers._id},(error, result)=>{
                            if(error)
                                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
                            else if(!result){
                                Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "User doesn't exist.")
                            }
                            else{
                                if(result.status == "ACTIVE")
                                 next();
                                else if(result.status == "INACTIVE") 
                                 Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "User doesn't exist.")
                                else
                                Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "User blocked by admin.")  
                            }                        
                        })
                }
            })
        }else{
            Response.sendResponseWithoutData(res, 403, "No token provided.")
        }

    }
};


module.exports = auth;