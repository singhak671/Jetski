var mongoose = require('mongoose');
var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var paginate = require('mongoose-query-paginate');
var cloudinary = require("../common_functions/uploadImage.js");
var each = require('async-each-series');
var eventSchema= require('../models/eventManagementModel');
var moment = require('moment');
var User=require("../models/userModel.js");
//var userSchema = require("../models/userModel");
moment().format();

module.exports = {

'addEvent': (req, res) => {
    //  console.log("addddddddddddd", req.body);
      
      if(!req.body){
         return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
      }
   
    User.findById(req.body.userId,(err4,succ)=>{
        if(err4)
        return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.",err3);
    if(!succ)
    return response.sendResponseWithData(res, responseCode.NOT_FOUND,"UserId not found");
    eventSchema.findOne({userId:req.body.userId,eventName:req.body.eventName},(err5,succ1)=>{
    if(err5)
        return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.",err5);
    if(succ1){console.log("successss>>>>>>>",succ1);
        return response.sendResponseWithData(res, responseCode.BAD_REQUEST,"Event name already exists");        
    }
         var base64= req.body.eventImage
          cloudinary.uploadImage(base64, (err, result) => {
                  if(result){
                    req.body.eventImage = result;
                  }  
                  var business = new eventSchema(req.body)
                  business.save((err2, createEvent) => {
                      if (err2) {
                          console.log("business added error>>>>>>>>>>>", err2)
                          response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.",err2)
                      }
                      else if (createEvent) {
                         
                          response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.",createEvent);
                          console.log("fgfgjgdfjgdfgh",createEvent)
                          console.log("please check",createEvent._id)
                          console.log("push value",{$push:{eventId:createEvent._id}})
                          console.log("userid",{_id:req.body.userId})
                          User.findByIdAndUpdate({_id:req.body.userId},{$push:{eventId:createEvent._id}},{new:true},(err3,success)=>{
                              console.log("success",success)
                              if(err3)
                                  console.log(err3)
                                if(!success)
                              console.log("cannot update userId with the event update")
                          })
                      }
                      else
                          response.sendResponseWithData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!",err2)
                  })                
          })
        }) 
    })
  },

//..................................................................GetAllDetail of Customer API for Admin panel............................................................................... //

  'getAllBusiness': (req, res) => {
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
    User.paginate({$and:[{userType:("BUSINESS")},{status:"ACTIVE"}]}, options, (error,result)=> {
        if(error)
            respondatedatese.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR,"server err",error )
        else if(result.docs.length==0)
           response.sendResponseWithData(res, resCode.NOT_FOUND, resMessage.NOT_FOUND)
        else
        {
            console.log("result is"+JSON.stringify(result))
            result.docs.map(x => delete x['password'])
            response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result.docs,{total:result.total,limit:result.limit,currentPage:result.page,totalPage:result.pages});
        }
    })
 },        



//   //..................................................................EditCustomer Detail API for Admin panel............................................................................... //

//   "editBusiness": (req, res) => {
//     console.log((req.body));
//     // if(req.body._id!=req.body._id){
//     // console.log("headerId and UserId not match")
//     // return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Provided UserData not match.");
//     // }
//     userSchema.findOne({ _id: req.body._id, status: "ACTIVE" }, (err, success) => {
//         if (err)
//             return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.WENT_WRONG);
//         if (!success)
//             return Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "UserId Not found");
//         //success part
//         cloudinary.uploadImage(req.body.profilePic, (err, result) => {
//             console.log("login result On controller", result, "err", err);
//             if (err)
//                 return Response.sendResponseWithoutData(res, resCode.WENT_WRONG, "Picture not uploaded successfully");
//             if (result)
//                 req.body.profilePic = result;
//             userSchema.findByIdAndUpdate({ _id: req.body._id, status: "ACTIVE" }, req.body, { new: true, select: { "password": 0 } }, (err2, final) => {
//                 if (err2 || !final)
//                     return Response.sendResponseWithData(res, resCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
//                 return Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Profile Uploaded successfully.", final)

//             })

//         })



//     })

// },



}



