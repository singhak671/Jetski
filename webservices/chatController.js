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
        if (!req.body.eventId || !req.body.businesssManId || !req.body.message[0].senderId || !req.body.customerId || !req.body.message[0].message)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            User.findOne({ _id: req.body.customerId, _id: req.body.businesssManId, status: "ACTIVE" }, (err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (success == false)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
                else{
                    console.log(`Success---->${JSON.stringify(success)}`)
                    var token=success.deviceToken;
                    var image=success.profilePic;
                    var name=success.name;
                  //  var deviceType=success.deviceType;
                    var sub=success.pushSubscription;
                    console.log(`token------------>${sub}`)
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
                                else{
                                    console.log(`success3============>${JSON.stringify(success3)}`)
                                   //  notification.push('new Notification','sdfsdffdsfgdsgf',sub,'ph-gauri@mobiloitte.com','5b77b6d45168a1e5d0de3be6')
                                //   if(deviceType=="WEBSITE")
                         //    var token="eyfiZcK4Kbw:APA91bEfjmApOL1630LUBDSjnegjwfvoyYESb1inwWDLuVOnlTxas4C3FKl9_0-6MoU42xmZtrQ2f2bxM4vMISeYsDgFbqSzAAioZ6BP5UqmvIxtjVKNhVLSSAe2DsvKQRjdIyC0v6bu"
                            console.log("*******noti data***********************",token, 'New Message.', 'fdhfdhfdh' , req.body.businesssManId,req.body.customerId,image,name)
                                  // notification.single_notificationForWeb(token, 'New Message.', 'fdhfdhfdh' , req.body.businesssManId,req.body.customerId,image,name)
                                  // if(deviceType=="ANDROID"||deviceType=="IOS")
                                 //  notification.single_notification(token, 'New Message.', req.body.message , req.body.businesssManId,req.body.customerId)
                                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, success3);
                                }  
                            })
                        })
                    }      
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
    },
    // 'notificationList': (req, res) => {
    //     console.log(`Request for notification list ${JSON.stringify(req.body)}`)
    //     let options = {
    //         page: req.body.pageNumber,
    //         limit:10,
    //         sort: { createdAt: -1 }
    //     };
    //     chatSchema.paginate({"bussinessId.bid":req.body.bussinessId,noti_type:'BUSSINESS'}, options, (error, result)=>{
    //         if(error)
    //             response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
    //         else{
    //             console.log("noti list===>",JSON.stringify(result))
    //             response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, 'Notifications found successfilly.', result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages })
    //         }       
    //     })
    // },
    // 'unreadCount': (req, res) =>{
    //     console.log(`Request for unread notification count ${req.params.bussinessId}`)
    //     Notification.count({"bussinessId.bid":req.params.bussinessId,noti_type:'BUSSINESS',"bussinessId.isRead":false}, (error,result)=>{
    //         if(error)
    //             response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
    //         else    
    //             response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Unread count found successfully.', result);
    //     })
    // },
    // 'updateReadStatus': (req, res) => {
    //     console.log(`Request for unread notification count -> ${req.params.bussinessId}`)
    //     Notification.updateMany({"bussinessId.bid":req.params.bussinessId,noti_type:'BUSSINESS'},{$set:{"bussinessId.isRead":true}}, (error,result)=>{
    //         if(error)
    //             response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
    //         else if(result.matchedCount == result.modifiedCount) {
    //             console.log("***************************",result.matchedCount,result.modifiedCount)
    //             response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', 0);
    //         }   
    //         else
    //             response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', result.matchedCount-result.modifiedCount);
    //     })
    // },



}
