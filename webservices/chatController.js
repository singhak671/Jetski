var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var eventSchema = require('../models/eventManagementModel');
var User = require("../models/userModel.js");
const chatSchema = require('../models/message')
const waterfall = require('async-waterfall');

module.exports = {

    "chatAPI": (req, res) => {
        var businesssManId = req.body.businesssManId;
        var customerId = req.body.customerId;
        var eventId = req.body.eventId;
        var message = req.body.message[0].message


        User.findOne({ _id: req.body.customerId }, (err, success) => {

            if (err)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);

            if (!success)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
            if (success) {
                chatSchema.find({}).exec((err1, succ1) => {
                    console.log('err1,succ1', err1, succ1);
                    if (err1)
                        return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                    if (succ1 == undefined || succ1 == '' || succ1 == [] || succ1 == null) {
                        console.log('i m here');
                        var chatSchema_data = new chatSchema({
                            businesssManId: businesssManId,
                            customerId: customerId,
                            message: {
                                senderId: success._id,
                                message: message
                            },
                            eventId: eventId
                        })
                        chatSchema_data.save((err2, succ2) => {
                            if (err2)
                                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                            else if (succ2)
                                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ2);
                        })
                    }
                    else if (!succ1==false) {
                        var query = {
                            businesssManId: businesssManId,
                            customerId: customerId,
                            eventId: eventId,

                        }
                        var data = {};
                        data.senderId = success._id;
                        data.message = message;
                        chatSchema.findOneAndUpdate(query, { $push: { message: data } }, { new: true }).exec((err3, succ3) => {
                            if (err3)
                                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                            else if (succ3) {
                               
                                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ3);
                            }
                        })
                    }
                })
            }

        })

    }
    // "getAllChats":(req,res)=>
    // {
    //     var data={}
    //     chatSchema.find({}).exec((err,succ)=>
    // {
    //     if(err)
    //     return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
    //     else if(succ)
    //     {
    //         waterfall([
    //             function(callback)
    //             {
    //                 for(var i=0;i<succ.length;i++)
    //                 {

    //                 }
    //             }
                
    //         ],(err,result)=>
    //     {
            
    //     })
    //     }
    // })
    // }



}
