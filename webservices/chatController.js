var response = require('../common_functions/response_handler');
var mongoose = require('mongoose');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var eventSchema = require('../models/eventManagementModel');
var User = require("../models/userModel.js");
const chatSchema = require('../models/message')
const waterfall = require('async-waterfall');

module.exports = {
    //***********************************************************************************chat API****************************************************************************/

    "chatAPI": (req, res) => {
        if (!req.body.eventId || !req.body.businesssManId || !req.body.message[0].senderId || !req.body.customerId || !req.body.message[0].message)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            User.findOne({ _id: req.body.customerId, _id: req.body.businesssManId, status: "ACTIVE" }, (err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (success == false)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
                else
                    eventSchema.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (err, success2) => {
                        if (err)
                            return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                        else if (!success2)
                            return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "EventId Not found");
                        else
                            console.log("eventId>>", req.body.eventId, "business>>", req.body.businesssManId, "req.body.>>>>>", req.body.customerId)
                        chatSchema.findOneAndUpdate({ eventId: req.body.eventId, businessManId: req.body.businesssManId, customerId: req.body.customerId }, { $push: { message: req.body.message } }, { new: true, upsert: true })
                            .populate("message.senderId", "_id name profilePic")
                            .exec((err, success3) => {
                                console.log("i am here>>>>", err, success3)
                                if (err)
                                    return response.sendResponseWithData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG, err);
                                else if (!success3)
                                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Cannot send message !");
                                else

                                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, success3);
                            })
                    })
            })


    },
    "chatHistory": (req, res) => {
        if (!req.body.eventId || !req.body.businesssManId || !req.body.customerId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            chatSchema.findOne({ businessManId: req.body.businesssManId, customerId: req.body.customerId, eventId: req.body.eventId }).populate("message.senderId", "_id name profilePic").exec((err, succ) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                if (!succ)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found!");
                else if (succ) {
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                }

            })
    }



}
