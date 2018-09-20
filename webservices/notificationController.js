const User = require('../models/userModel');
const response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage');
const noti = require('../common_functions/notification');
const Notification = require('../models/notificationModel');
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
let subscribers = [];
const notiApi = {
    //================================Notification shown in web===============================================================//
    'notificationList': (req, res) => {
        let options = {
            page: req.body.pageNumber,
            limit: 10,
            sort: { createdAt: -1 }
        };
        Notification.paginate({ "bussinessId.bid": req.body.bussinessId, noti_type: 'BUSINESS' }, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0) {
                response.sendResponseWithoutData(res, resCode.NOT_FOUND, "Data not found")
            }
            else {
                response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, 'Notifications found successfully.', result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages })
            }
        })
    },
    //================================Unread Notification shown in web===============================================================//

    'unreadCount': (req, res) => {
        Notification.count({ "bussinessId.bid": req.params.bussinessId, noti_type: 'BUSINESS', "bussinessId.isRead": false }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else
                response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Unread count found successfully.', result);
        })
    },

    //================================ read Notification shown in web===============================================================//

    'updateReadStatus': (req, res) => {
        Notification.updateMany({ "bussinessId.bid": req.params.bussinessId, noti_type: 'BUSINESS' }, { $set: { "bussinessId.isRead": true } }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else if (result.matchedCount == result.modifiedCount) {
                response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', 0);
            }
            else
                response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', result.matchedCount - result.modifiedCount);
        })
    },
    //================================Notification shown in customer===============================================================

    'customerNotification': (req, res) => {
        let options = {
            page: req.body.pageNumber,
            limit: 10,
            sort: { createdAt: -1 }
        };
        Notification.paginate({ "customerId.cid": req.body.customerId, noti_type: 'CUSTOMER' }, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            else {
                response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, 'Notifications found successfully.', result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages })
            }
        })
    },
}

module.exports = notiApi;