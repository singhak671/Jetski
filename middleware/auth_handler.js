const jwt = require('jsonwebtoken');
const config = require('../config/config')();
const Response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode')
const resMessage = require('../helper/httpResponseMessage');
const userSchema = require('../models/userModel');
 
const auth = { 
   verifyToken: (req, res, next)=>{
       // var token =  req.headers.token ;
        console.log("header>>>>>>>"+req.headers._id+"  token is >>>>>>"+req.headers.token)           
        if(req.headers.token){
            console.log("secret key is "+config.secret_key)
            jwt.verify(req.headers.token, config.secret_key, (err,result)=>{
                
                if(err)
                {
                    console.log("token not verified",err)
                    Response.sendResponseWithoutData(res, 403, "Invalid token provided.")
0                }    
                else{
                    console.log("token verified")
                    userSchema.findOne({_id:req.headers._id},(error, result)=>{
                            console.log("result of user "+ JSON.stringify(result))
                            if(error)
                                Response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
                            else if(!result){
                                console.log("null user entered")
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
// verifyToken: (req, res, next) => {
//     console.log("req.headers.token-=========>>>>", req.headers.token)
//     if (req.headers.token == "null" || req.headers.token == "" || req.headers.token == "undefined" || req.headers.token == null || req.headers.token == undefined) {
//         console.log("token not verified",err)
//          Response.sendResponseWithoutData(res, resCode.UNAUTHORIZED, "Authentication failed.")
//     }
//     jwt.verify(req.headers.token, config.Secret_Key, (err, decoded) => {
//     console.log("verify token", decoded)
//     if (err) {
//         Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG)
//     } else {
//     next();
//     }
//     })
//     }
// };

module.exports = auth;