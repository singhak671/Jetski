var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var eventSchema = require('../models/eventManagementModel');
var User = require("../models/userModel.js");
const chatSchema = require('../models/message')

module.exports = {

    "chatAPI": (req, res) => {
        var query = {
            businesssManId:req.body.businessId,
            customerId: req.body.customerId,
            eventId: req.body.eventId

        }
        chatSchema.findOne({ _id: req.body.customerId }, (err, success) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
            if (!success)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
            if (success) {
                User.findOne(query, { $push: { message: { senderId: req.body.userId, message: req.body.message } } }, { new: true }, (err3, succ) => {
                    if (err3)
                        return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                    if (!succ)
                        return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");

                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                })
            }

        })

    }



}
