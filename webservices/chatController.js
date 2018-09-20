var response = require('../common_functions/response_handler');
var mongoose = require('mongoose');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var eventSchema = require('../models/eventManagementModel');
var User = require("../models/userModel.js");
const chatSchema = require('../models/message')
const waterfall = require('async-waterfall');
const notification = require('../common_functions/notification');
const Noti = require('../models/notificationModel');

module.exports = {
    //***********************************************************************************chat API****************************************************************************/

    "chatAPI": (req, res) => {
        var deviceType, deviceToken, name, profilePic, notiObj, data;
        if (!req.body.eventId || !req.body.businesssManId || !req.body.message[0].senderId || !req.body.customerId || !req.body.message[0].message)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else {
            User.findOne({ $or: [{ _id: req.body.customerId }, { _id: req.body.businesssManId }], status: "ACTIVE" }, (err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (success == false)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
                else {
                    eventSchema.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (err, success2) => {
                        if (err)
                            return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                        else if (!success2)
                            return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "EventId Not found");
                        else {
                            chatSchema.findOneAndUpdate({ eventId: req.body.eventId, businessManId: req.body.businesssManId, customerId: req.body.customerId }, { $push: { message: req.body.message } }, { new: true, upsert: true })
                            .populate("message.senderId", "_id name profilePic")
                            .populate('businessManId', '_id name deviceToken deviceType profilePic')
                            .populate('customerId', '_id name deviceType deviceToken profilePic')
                            .exec((err, success3) => {
                                if (err)
                                    return response.sendResponseWithData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG, err);
                                else if (!success3)
                                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Cannot send message !");
                                else {
                                    if (req.body.businesssManId == req.body.message[0].senderId) {
                                        deviceType = success3.customerId.deviceType
                                        deviceToken = success3.customerId.deviceToken
                                        name = success3.businessManId.name
                                        eventId = req.body.eventId
                                        profilePic = success3.businessManId.profilePic
                                        notiObj = {
                                            userId: req.body.businesssManId,
                                            profilePic: profilePic,
                                            name: name,
                                            type: 'chat'
                                        }
                                        data = notiObj
                                        data.chatData = req.body
                                    } else {
                                        deviceType = success3.businessManId.deviceType
                                        name = success3.customerId.name
                                        eventId = req.body.eventId
                                        profilePic = success3.customerId.profilePic
                                        notiObj = {
                                            userId: req.body.customerId,
                                            profilePic: profilePic,
                                            name: name,
                                            type: 'chat'
                                        }
                                        data = notiObj
                                        data.chatData = req.body
                                    }

                                    if (deviceType == 'IOS') {
                                        notification.sendNotification(deviceToken, `${name} has send you message:`, `${req.body.message[0].message}`, data, notiObj)
                                    }
                                    if (deviceType == 'ANDROID') {
                                        notification.sendNotification(deviceToken, `${name} has send you message:`, `${req.body.message[0].message}`, data, notiObj)
                                    }

                                    notification.single_notification(`${name}`, `${req.body.message[0].message}`, req.body.businesssManId, req.body.customerId, profilePic, name, 'chat', 'CONFIRMED', eventId)

                                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, success3);
                                }
                            })
                        }

                    })
                }
            })
        }
    },

    //**************************************************************************chat API History*******************************************************/


    "chatHistory": (req, res) => {
        if (!req.body.eventId || !req.body.businesssManId || !req.body.customerId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            chatSchema.findOne({ businessManId: req.body.businesssManId, customerId: req.body.customerId, eventId: req.body.eventId }).populate("message.senderId", "_id name profilePic").exec((err, succ) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (succ || !succ) {
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                }

            })
    },
}
