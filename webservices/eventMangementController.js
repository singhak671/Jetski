var mongoose = require('mongoose');
var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var paginate = require('mongoose-paginate');
var cloudinary = require("../common_functions/uploadImage.js");
var eventSchema = require('../models/eventManagementModel');
var moment = require('moment');
var User = require("../models/userModel.js");
var booking = require("../models/bookingModel.js")
var feedback = require("../models/customerFeedbackModel.js")
const waterfall = require('async-waterfall')
const async = require('async');
const keySecret = 'sk_test_7OyC78h4UYqhcEiH2N2vcX9O';//client
const stripe = require("stripe")(keySecret);
const notification = require('../common_functions/notification');
const Noti = require('../models/notificationModel');
const cron = require('node-cron');
moment().format();

function joinDateTime(d, t, offset) {
    var dateString = d + " " + t,
        dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = (dateTimeParts[0].split('-')).reverse(),
        date;

    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    var n = (new Date().getTimezoneOffset()) * 60000;  //-19800000
    offset = n - offset;
    var finalObj = { dateTime: (date.getTime()) - offset }
    return finalObj;
}

function validateEvent(duration, offset) {
    var eventShowTimeArr = [];
    duration.map(x =>
        x.times.map(y => eventShowTimeArr.push(joinDateTime(x.date.formatted, y.time, offset)))
    )

    var currentTime = new Date().getTime();
    var index = eventShowTimeArr.findIndex(z => (z.dateTime - currentTime) <= 0);

    if (index != -1) {
        return false;
    } else {
        return true;
    }
}

function filterFutureEvent(duration, offset) {
    let currentTime = new Date().getTime();
    duration.map(x => {
        if (((new Date(x.date.formatted).getTime() + 84600000) - currentTime) <= 0) {
            x.isExpired = true;
        }
        else {
            x.isExpired = false;
            x.times.map(y => {
                var obj = joinDateTime(x.date.formatted, y.time, offset)
                y.epoc = obj.dateTime;
                if ((obj.dateTime - currentTime) <= 0)
                    y.isExpired = true
                else
                    y.isExpired = false
            })
        }
    })
    return duration;
}



module.exports = {

    //.....................................................................Add event API...........................................................//

    'addEvent': (req, res) => {
        if (!req.body) {
            return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
        }
        User.findById(req.body.userId, (err4, succ) => {
            if (err4)
                return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
            if (!succ)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
            eventSchema.findOne({ userId: req.body.userId, eventName: req.body.eventName }, (err5, succ1) => {
                if (err5)
                    return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
                if (succ1) {
                    return response.sendResponseWithData(res, responseCode.BAD_REQUEST, "Event name already exists");
                }
                var base64 = req.body.eventImage
                cloudinary.uploadImage(base64, (err, result) => {
                    if (result) {
                        req.body.eventImage = result;
                    }
                    var business = new eventSchema(req.body)
                    var durationArr = business.duration;

                    var valid = validateEvent(durationArr, req.body.offset);
                    if (!valid) {
                        return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please provide correct duration time");
                    }
                    else {
                        business.save((err2, createEvent) => {
                            if (err2) {
                                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
                            }
                            else if (createEvent) {
                                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.", createEvent);
                                User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { services: { eventId: createEvent._id } } }, { new: true }, (err3, success) => {
                                    if (err3)
                                       return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
                                    if (!success)
                                     return response.sendResponseWithData(res, responseCode.NOT_FOUND, "cannot update userId with the event update");

                                })
                            }
                            else
                                response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!", err2)
                        })
                    }
                })
            })
        })
    },

    //-------------------------------------------------------------------------All Event at business site before login-------------------------------------------------------------------------//
    'allEvent': (req, res) => {
        var doc_arr = [];
        var result_new;
        var query = { status: "ACTIVE" };
        let options = {
            page: req.body.pageNumber || 1,
            select: 'period eventAddress createdAt eventImage offset duration eventName status eventDescription eventPrice ',
            limit: req.body.limit || 5,
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'profilePic businessName name status', match: { status: "ACTIVE" } },
            lean: true
        }
        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                waterfall([
                    function (callback) {
                        var result_new = result;
                        if (result.docs.length != 0) {
                            result.docs.map(x => x.duration = filterFutureEvent(x.duration, x.offset))
                            result.docs.map(x => x.duration = x.duration.filter(y => y.isExpired == false))
                            result.docs.map(x => x.duration.length > 0 ? x.duration.map(z => z.times = z.times.filter(k => k.isExpired == false)) : null);
                            result.docs.map(x => x.duration = x.duration.filter(y => y.times.length != 0))
                            result.docs = result.docs.filter(x => x.duration.length != 0);
                            if (result.docs.length != 0)
                                callback(null, result);
                            else
                                callback(null, result);

                        } else {
                            callback(null, result);
                        }

                    }
                ], (err, result) => {
                    if (result.docs.length == 0)
                        response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found..")
                    else
                        response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
                })
            }
        })
    },


    //-------------------------------------------------------------------------------Describe  particular event after login-----------------------------------------------------------------//

    "eventDescription": (req, res) => {
        var event_id = req.body._id;
        var related_event = [];
        var data = {};
        waterfall([
            function (callback) {
                eventSchema.findOne({ '_id': event_id, status: "ACTIVE" }).exec((err, succ) => {
                    if (err)
                        response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                    else if (succ) {
                        data.description = succ;
                        callback(null, 'done');
                    }
                })
            },
            function (arg1, callback) {
                eventSchema.find({ status: "ACTIVE" }).sort({ eventCreated_At: -1 }).limit(5).exec((err, succ) => {
                    if (err)
                        response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                    else if (succ) {
                        for (var i = 0; i < succ.length; i++) {
                            if (succ[i]._id != event_id)
                                related_event.push(succ[i]);

                        }
                        callback(null, 'done');
                    }
                })
            }
        ], (err, success) => {
            data.related_event = related_event;
            response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, data);
        })
    },

    //-------------------------------------------------------------------------------alllatestEvent for app site as well as business website----------------------------------------------------------------//
    'latestEvents': (req, res) => {
        var doc_arr = [];
        var result_new;
        var query = { status: "ACTIVE" };
        let options = {
            page: req.body.pageNumber || 1,
            select: 'period eventAddress createdAt eventImage offset duration eventName status eventDescription eventPrice ',
            limit: req.body.limit || 5,
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'profilePic businessName name status', match: { status: "ACTIVE" } },
            lean: true
        }
        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                waterfall([
                    function (callback) {
                        var result_new = result;
                        if (result.docs.length != 0) {
                            result.docs.map(x => x.duration = filterFutureEvent(x.duration, x.offset))
                            result.docs.map(x => x.duration = x.duration.filter(y => y.isExpired == false))
                            result.docs.map(x => x.duration.length > 0 ? x.duration.map(z => z.times = z.times.filter(k => k.isExpired == false)) : null);
                            result.docs.map(x => x.duration = x.duration.filter(y => y.times.length != 0))
                            result.docs = result.docs.filter(x => x.duration.length != 0);
                            if (result.docs.length != 0)
                                callback(null, result);
                            else
                                callback(null, result);

                        } else {
                            callback(null, result);
                        }

                    }
                ], (err, result) => {
                    if (result.docs.length == 0)
                        response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found..")
                    else
                        response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
                })
            }
        })
    },






    //-------------------------------------------------------------------------------My Event at business site after login  -----------------------------------------------------------------//
    'myAllEvents': (req, res) => {
        var query = { $or: [{ userId: req.body.userId, status: "ACTIVE" }, { userId: req.body.userId, status: "ACTIVE" }] }
        let options = {
            select: 'period eventAddress createdAt eventImage offset duration eventName userId status eventDescription eventPrice ',
            limit: req.body.limit || 10,
            page: req.body.pageNumber || 1,
            sort: { createdAt: -1 },
            populate: {
                path: 'services.eventId', select: 'eventAddress duration  eventImage createdAt  eventName eventDescription period eventPrice ',

                match: { status: "ACTIVE" }
            },
            lean: false
        }
        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });

            }
        })
    },

    //------------------------------------------------------------------------------- API for Filter location in app   -----------------------------------------------------------------//
    "eventLocation": (req, res) => {
        eventSchema.find({ status: "ACTIVE" }).lean().exec((error, result) => {
            var eventAddressArr = [];
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (result.length == 0)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                result.map(x => x.duration = filterFutureEvent(x.duration, x.offset))
                result.map(x => x.duration = x.duration.filter(y => y.isExpired == false))
                result.map(x => x.duration.length > 0 ? x.duration.map(z => z.times = z.times.filter(k => k.isExpired == false)) : null);
                result.map(x => x.duration = x.duration.filter(y => y.times.length != 0))
                result = result.filter(x => x.duration.length != 0);
                if (result.length == 0) {
                    response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
                } else {
                    let unique = [...new Set(result.map(item => item.eventAddress))];
                    unique.map(x => eventAddressArr.push({ eventAddress: x }))
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, { eventAddress: eventAddressArr })
                }
            }
        })
    },

    //------------------------------------------------------------------------------- API for location choose in app   -----------------------------------------------------------------//


    "locationDetail": (req, res) => {
        var temp_data = {};
        let list = req.body.eventAddress.map((x) => x.eventAddress)
        let query = list.length > 0 ? { eventAddress: { $in: list }, status: "ACTIVE" } : { status: "ACTIVE" };
        eventSchema.find(query).populate("userId", { name: 1, profilePic: 1, businessName: 1 }).exec((error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                waterfall([
                    function (callback) {
                        var result_new = result;
                        if (result.length != 0) {
                            result.map(x => x.duration = filterFutureEvent(x.duration, x.offset))
                            result.map(x => x.duration = x.duration.filter(y => y.isExpired == false))
                            result.map(x => x.duration.length > 0 ? x.duration.map(z => z.times = z.times.filter(k => k.isExpired == false)) : null);
                            result.map(x => x.duration = x.duration.filter(y => y.times.length != 0))
                            result = result.filter(x => x.duration.length != 0);
                            if (result.length != 0)
                                callback(null, result);
                            else
                                callback(null, result);

                        } else {
                            callback(null, result);
                        }
                    }
                ], (err, result) => {
                    if (result.length == 0)
                        response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found..")
                    else
                        response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
                })
            }
        })
    },


    //------------------------------------------------------------------------------- API for Pending in business site   -----------------------------------------------------------------//


    "eventsPending": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "PENDING" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus customerCount eventCreated_At _id period eventName eventAddress eventDescription eventImage eventPrice createdAt" },
            { path: "userId", select: "profilePic name" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
            }
        })



    },



    //------------------------------------------------------------------------------- API for AllConfirm in business site   -----------------------------------------------------------------//


    "eventsConfirmed": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "CONFIRMED" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus customerCount eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage " },
            { path: "userId", select: "profilePic name deviceToken" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
            }
        })
    },




    //------------------------------------------------------------------------------- API for AllCancel in business site   -----------------------------------------------------------------//


    "eventsCancelled": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "CANCELLED" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus customerCount  _id period eventName eventAddress eventDescription  eventImage " },
            { path: "userId", select: "profilePic name" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
            }
        })



    },




    //------------------------------------------------------------------------------- API for AllCancel in business site   -----------------------------------------------------------------//


    "eventsCompleted": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "COMPLETED" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus customerCount eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage " },
            { path: "userId", select: "profilePic name" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
            }
        })



    },





    //------------------------------------------------------------------------------- API for myAllBooking for APP   -----------------------------------------------------------------//


    "myBooking": (req, res) => {
        var query = { userId: req.body.userId }
        let options = {
            page: req.body.pagenumber || 1,
            limit: 10,
            sort: { createdAt: -1 },
            lean: true,
            populate: [{ path: 'businessManId', select: 'profilePic  name' }, { path: "eventId", select: "status  eventCreated_At _id eventName eventAddress eventDescription customerCount eventPrice eventImage createdAt" }]

        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });

            }
        })
    },

    //------------------------------------------------------------------------------- API for filter >>PENDING for business   -----------------------------------------------------------------//


    "filterEventsPending": (req, res) => {
        var query = { businessManId: req.body.userId, bookingStatus: "PENDING" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id  eventName eventAddress eventDescription eventImage createdAt" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { eventCreated_At: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result == false || result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
            }
        })
    },


    //------------------------------------------------------------------------------- API for filter >>CONFIRM for business   -----------------------------------------------------------------//

    "filterEventsConfirm": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "CONFIRMED" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus customerCount  _id  eventName eventAddress eventDescription  eventImage createdAt" }],
            select: 'customerCount  duration eventPrice period',
            limit: req.body.limit || 10,
            sort: { eventCreated_At: -1 },
            lean: false
        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (!result)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
            }
        })
    },

    //------------------------------------------------------------------------------- API for Confirm individual in business site   -----------------------------------------------------------------//
    "confirmEventStatus": (req, res) => {
        booking.findByIdAndUpdate({ _id: req.body.bookingId }, { $set: { bookingStatus: "CONFIRMED" } }, { new: true }).populate({ path: "userId", select: "deviceToken name profilePic deviceType" }).exec((error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                var result = result
                var event;
                eventSchema.findById({ _id: result.eventId, status: "ACTIVE" }).exec((err_, result_) => {
                    if (err_)
                        response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else {

                        event = result_.eventName;
                        var notiObj = {
                            businessManId: result.businessManId,
                            userId: result.userId._id,
                            profilePic: result.userId.profilePic,
                            name: result.userId.name,
                            eventId: result.eventId,
                            type: 'event',
                            eventStatus: 'CONFIRMED'
                        }
                        if (result.userId.deviceType == 'IOS') {
                            notification.sendNotification(result.userId.deviceToken, `Booking Confirmation:`, `Your booking has been confirmed for the event ${event}`, notiObj, notiObj)
                        }


                        if (result.userId.deviceType == 'ANDROID') {
                            notification.sendNotification(result.userId.deviceToken, `Booking Confirmation:`, `Your booking has been confirmed for the event ${event}`, notiObj, notiObj)
                        }
                    }
                    response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is confirmed")
                })

            }

        })
    },

    //------------------------------------------------------------------------------- API for Reject individual in business site   -----------------------------------------------------------------//

    "rejectEventStatus": (req, res) => {
        booking.findById({ _id: req.body.bookingId }).populate({ path: "userId", select: "deviceToken name profilePic deviceType" }).exec((error, result) => {
            if (error)
                response.sendResponseWithData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG, error)
            else if (!result)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND, result)
            else {
                var result = result
                var event;
                eventSchema.findById({ _id: result.eventId, status: "ACTIVE" }, (err_, result_) => {
                    if (err_)
                        response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else {
                        event = result_.eventName;
                        return stripe.refunds.create({
                            charge: result.chargeId,
                            amount: (result.eventPrice),
                        }, function (err, refund) {
                            if (err) {
                                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Error occur during payment as the amount has already been refunded.")
                            }
                            else {
                                booking.findByIdAndUpdate({ _id: req.body.bookingId }, { $set: { bookingStatus: "CANCELLED", paymentStatus: "Refund" } }, { new: true }).exec((err_1, result_1) => {
                                    if (err_1)
                                        response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Error occur ")
                                    else {
                                        var notiObj = {
                                            businessManId: result.businessManId,
                                            userId: result.userId._id,
                                            profilePic: result.userId.profilePic,
                                            name: result.userId.name,
                                            eventId: result.eventId,
                                            type: 'event',
                                            eventStatus: 'CANCELLED'
                                        }

                                        if (result.userId.deviceType == 'IOS')
                                            notification.sendNotification(result.userId.deviceToken, `Booking cancelled:`, `Your booking has been cancelled for the event ${event}`, notiObj, notiObj)
                                        if (result.userId.deviceType == 'ANDROID') {
                                            notification.sendNotification(result.userId.deviceToken, `Booking cancelled:`, `Your booking has been cancelled for the event ${event}`, notiObj, notiObj)
                                        }

                                    }
                                    response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is cancelled")

                                })
                            }
                        })
                    }
                })
            }
        })
    },

    //------------------------------------------------------------------------------- Filter DAILY/WEEKLY/MONTHLY for APP (BookNow &&& Reschedule Booking) s  -----------------------------------------------------------------//
    "bookingEvent": (req, res) => {
        var date = new Date();
        var newDate = date.toJSON()
        var array = newDate.split("T")[0]
        var newDate1 = array + " 00:00:00"
        var d = new Date(newDate1)
        var Time_stamp = d.getTime();
        let todayArray = [];
        eventSchema.findOne({ _id: req.body.eventId, status: "ACTIVE" }, { period: 1, duration: 1 }, (err, success) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
            if (!success)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Data not found.", success);
            else {
                for (var i = 0; i < success.duration.length; i++) {
                    if (success.duration[i].date.epoc * 1000 >= Time_stamp) {
                        todayArray.push(success.duration[i])
                        var abcobj = {
                            todayArray: todayArray,
                            period: success.period
                        }
                    }
                }
                return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", abcobj);
            }
        })
    },

    //---------------------------------------------------------------booking API-------------------------------------------------------------------------------//
   
    'booking': (req, res) => {
        if (!req.body) {
            return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
        }
        else {
            var deviceTypeWeb, profilePic, name
            User.findOne({ _id: req.body.userId, userType: "CUSTOMER", status: "ACTIVE" }, (err4, succ) => {
                if (err4)
                    return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err4);
                if (!succ)
                    return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
                else {

                    var email = succ.email
                    async.waterfall([(callback) => {
                        eventSchema.findOne({ _id: req.body.eventId }).populate({ path: 'userId', select: 'deviceType email mobile_no deviceToken name profilePic' }).exec((err5, succ1) => {//
                            if (err5)
                                return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
                            if (!succ1) {
                                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "eventId Not found");
                            }
                            else {
                                deviceTypeWeb = succ1.userId.deviceType
                                profilePic = succ1.userId.profilePic
                                name = succ1.userId.name
                                email = succ1.userId.email
                                var array = [];
                                array = req.body.duration[0].times;
                                if (validateEvent(req.body.duration, req.body.offset)) {
                                }
                                else
                                    return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Booking time expired..");
                                callback(null, succ1)
                            }
                        })
                    }, (data, callback) => {
                        var charge1;
                        stripe.customers.create({
                            email: email,
                            source: req.body.stripeToken
                        }).then((customer) => {
                            if (!customer)
                                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, " No such token.... ")
                            else {
                                return stripe.charges.create({
                                    amount: req.body.eventPrice * 100,
                                    currency: "usd",
                                    customer: customer.id
                                })
                            }
                        })
                            .then((charge) => {
                                charge1 = charge
                                if (!charge1) {

                                    response.sendResponseWithoutData(res, responseCode.WENT_WRONG, "Your card is not active.")
                                }
                                else {
                                    var obj = {
                                        eventId: req.body.eventId,
                                        userId: req.body.userId,
                                        businessManId: req.body.businessManId,
                                        duration: req.body.duration,
                                        offset: req.body.offset,
                                        eventName: req.body.eventName,
                                        businessName: req.body.businessName,
                                        customerCount: req.body.customerCount,
                                        customerName: req.body.customerName,
                                        period: req.body.period,
                                        "transactionDate": req.body.transactionDate,
                                        "transactionTime": req.body.transactionTime,
                                        "transactionTimeStamp": req.body.transactionTimeStamp,
                                        "paymentStatus": charge1.status,
                                        "chargeId": charge1.id,
                                        "bookingStatus": "PENDING",
                                        "eventPrice": req.body.eventPrice
                                    }
                                    booking.create(obj, (err_, result_) => {
                                        if (err_)
                                        response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                                        else {
                                            callback('', result_)
                                        }
                                    })
                                }
                            })
                    },], (err, result) => {
                        if (err) {
                            response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                        } else {
                            var notiObj = {
                                businessManId: req.body.businessManId,
                                customerCount: req.body.customerCount,
                                userId: req.body.userId,
                                profilePic: succ.profilePic,
                                name: succ.name,
                                eventId: req.body.eventId,
                                type: 'event',
                                eventStatus: 'PENDING'
                            }
                            if (succ.deviceType == 'IOS') {
                                notification.sendNotification(succ.deviceToken, 'booking Posted !', `You have successfully book the event ${result.eventName}` + '\n' + ` Number of Riders: ${req.body.customerCount} People ` + '\n' + ` Contact Us: ${email}`, notiObj , notiObj)
                            }

                            if (succ.deviceType == 'ANDROID') {               
                                notification.sendNotification(succ.deviceToken, 'booking Posted !', `You have successfully book the event ${result.eventName}` + '\n' + ` Number of Riders: ${req.body.customerCount} People ` + '\n' + ` Contact Us: ${email}`, notiObj, notiObj)
                            }

                            notification.single_notification(`booking Posted !`, `Booking is successfully done by ${notiObj.name} , requested for the event ${result.eventName} ` + '\n' + ` Number of Riders: ${req.body.customerCount} People ` + '\n' + ` Mobile: ${succ.mobile_no} ` + '\n' + ` Email: ${succ.email}`, req.body.businessManId, req.body.userId, notiObj.profilePic, notiObj.name, 'event', 'PENDING', req.body.eventId)                         
                            response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Payment successfully done!")
                        }
                    })
                }
            })
        }
    },

    ////---------------------------------------------------------------cancel booking for app//-----------------------------------------------------------------------//
    'cancelBooking': (req, res) => {
        var query = { _id: req.body._id, $or: [{ bookingStatus: "PENDING" }, { bookingStatus: "CONFIRMED" }] }
        booking.findOneAndUpdate(query, { $set: { bookingStatus: "CANCELLED" } }, { new: true })
            .populate("businessManId", "deviceType deviceToken profilePic name").exec((err, result) => {
                if (err) {
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                }
                if (!result)
                    return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Data not found")
                else {

                    var result = result;
                    User.findById({ _id: result.userId, userType: "CUSTOMER", status: "ACTIVE" }, (err_, result_) => {
                        if (err_)
                            return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                        else {
                            var amount = ((80 * result.eventPrice) / 100) * 100
                            return stripe.refunds.create({
                                charge: result.chargeId,
                                amount: Math.round(amount),
                            }, function (err, refund) {
                                if (err) {
                                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                                }
                                else {
                                    var notiObj = {
                                        businessManId: result.businessManId._id,
                                        userId: result_._id,
                                        profilePic: result_.profilePic,
                                        name: result_.name,
                                        eventId: result.eventId,
                                        type: 'event',
                                        eventStatus: 'CANCELLED'
                                    }
                                    if (result_.deviceType == 'IOS') {
                                        notification.sendNotification(result_.deviceToken, 'Booking Cancelled!!', `Your booking is  Cancelled for the event ${result.eventName} and your amount will be refunded...!`, notiObj, notiObj)
                                    }
                                    if (result_.deviceType == 'ANDROID') {
                                        notification.sendNotification(result_.deviceToken, 'Booking Cancelled!!', ` Your booking is  Cancelled for the event ${result.eventName} and your amount will be refunded...!`, notiObj, notiObj)
                                    }
                                    notification.single_notification(`Booking Cancelled!!`, `Booking has been cancelled for ${result.eventName} by ${result_.name} `, result.businessManId._id, notiObj.userId, notiObj.profilePic, result_.name, 'event', 'CANCELLED', result.eventId)
                                    response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Booking cancelled successfully and your amount will be refunded...")

                                }
                            })
                        }
                    })

                }
            })
    },


    //-------------------------------------------------------------------------------My all booking in app ----------------------------------------------------------------------//
    "myBookingShow": (req, res) => {
        var query = { userId: req.body.userId }
        booking.find({ userId: req.body.userId }, { eventId: 1, duration: 1, _id: 0 }).populate("eventId", { duration: 0, userId: 0 }).populate("userId", { name: 1, profilePic: 1 }).exec((error, result) => {
            if (error)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (result.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, result)
        })
    },


    ////-----------------------------------------------------  API for addCustomerFeedback  for App --------------------------------------------------------------//  */

    "addCustomerFeedback": (req, res) => {
        if (!req.body.eventId || !req.body.businessManId || !req.body.customerId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            User.findOne({ $or: [{ _id: req.body.businessManId }, { _id: req.body.customerId }], status: "ACTIVE" }, (err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (!success)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
                else {
                    eventSchema.findOne({ _id: req.body.eventId, businessName: req.body.businessName, status: "ACTIVE" }, (err, success2) => {
                        if (err)
                            return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                        else if (!success2)
                            return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Events data Not found");
                        else
                            feedback.findOneAndUpdate({ eventId: req.body.eventId, customerId: req.body.customerId, businessManId: req.body.businessManId }, { $set: { feedback: req.body.feedback } }, { new: true, upsert: true })
                                .populate("customerId", "name address profilePic").populate("eventId", "eventPrice")
                                .exec((err, success3) => {
                                    if (err)
                                        return response.sendResponseWithData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG, err);
                                    else if (success3.length == 0)
                                        return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Something went wrong....");
                                    else {
                                        if (success)
                                            notification.single_notification(`feedback Posted !`, ' Your feedback is successfully send.', req.body.businessManId, req.body.customerId, success.profilePic, success.name, 'feedback', 'COMPLETED', req.body.eventId)
                                        response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Feedback is successfully send.", success3);
                                    }

                                })
                    })
                }

            })
    },
    //-------------------------------------------------------------------------  API for viewCustomerFeedback  for App -------------------------------------------------------------------------  //

    "viewCustomerFeedback": (req, res) => {
        if (!req.body.eventId || !req.body.businessManId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else {

            feedback.find({ businessManId: req.body.businessManId, eventId: req.body.eventId }).populate("customerId", "name address profilePic").populate("eventId", "eventPrice").lean().exec((err, succ) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                if (succ.length == 0)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found!");
                else if (succ) {
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                }
            })
        }
    },

    //-------------------------------------------------------------------------  API for viewCustomerFeedback  for customer-------------------------------------------------------------------------  //
    "myEventFeedback": (req, res) => {
        if (!req.body.businessManId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else {
            feedback.find({ businessManId: req.body.businessManId }).populate("customerId", "_id name address profilePic").populate("eventId", "eventPrice").exec((err, succ) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                if (succ.length == 0)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found!");
                else if (succ) {
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                }
            })
        }
    },
    //................................................Average of rating according to paticular bssinessman.....................................
    'avgBussinessList': (req, res) => {
        feedback.aggregate(
            [
                { $unwind: "$feedback" },
                {
                    $group:
                    {
                        _id: { businessManId: "$businessManId", eventId: "$eventId" },
                        starsCount: { $avg: "$feedback.starsCount" },
                        businessName: { "$first": "$businessName" },
                    }
                },
                {
                    $lookup:
                    {
                        from: "businesses",
                        localField: "_id.eventId",
                        foreignField: "_id",
                        as: "bussiness"
                    }
                },
                { $unwind: "$bussiness" },
                { $project: { "businessName": "$businessName", "starsCount": "$starsCount", "eventPrice": "$bussiness.eventPrice", "eventDescription": "$bussiness.eventDescription" } }
            ]
        ).limit(5).exec((err, result) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
            else {

                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "List of all bussinessman's Average Rating found successfully.", result);
            }
        })
    },
    //-------------------------------------------------------------------------  API for viewCustomerFeedback  for website ------------------------------------------------------------------------- //

    "allFeedbackViews": (req, res) => {
        feedback.find({}).populate("customerId", "_id name address profilePic").populate("eventId", "eventPrice").exec((err, succ) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
            if (succ.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found!");
            else if (succ) {
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
            }

        })
    },

    //-------------------------------------------------------------------------  API for getting all events for Admin panel -------------------------------------------------------------------------  //


    'getAllEvents': (req, res) => {
        var n = req.body.pageNumber || 1, m = 10
        var value = new RegExp('^' + req.body.search, "i")
        var query = {
            $or: [{ $and: [{ status: "ACTIVE" }, { "businessName": value }] }, { $and: [{ status: "ACTIVE" }, { eventName: value }] }], status: "ACTIVE"
        }
        var options = {

            select: '_id eventName eventImage businessName eventCreated_At eventPrice',
            populate: [{ path: "userId", select: " status name ", match: { status: "ACTIVE" } }],
            limit: 100000000,
            sort: { eventCreated_At: -1 },
            lean: true
        }

        eventSchema.paginate(query, options, (err, result) => {
            if (err)
                return response.sendResponseWithData(res, responseCode.WENT_WRONG, "no result")
            else if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {

                var arr = result.docs.filter((x) => {
                    if (x.userId != null)
                        return x;
                })
                var userList1 = arr.slice((n - 1) * m, n * m)
                var x = {
                    "total": arr.length,
                    "limit": 10,
                    "currentPage": n,
                    "totalPage": Math.ceil(arr.length / 10)
                }
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, userList1, x);
            }

        })
    },



    //-------------------------------------------------------------------------  API transaction management >>> Admin panel -------------------------------------------------------------------------  //

    "transactionManagementFilter": (req, res) => {
        let options = {
            page: req.body.pageNumber || 1,
            limit: req.body.limit || 10,
            select: "transactionStatus bookingStatus eventName  eventPrice customerName businessName transactionDate transactionTime",
            populate: { path: 'userId', select: ' name status', match: { status: "ACTIVE" } },

            sort: { createdAt: -1 },
            lean: false
        }
        var obj;
        var query = { transactionDate: { $gte: req.body.fromDate, $lte: req.body.toDate } }
        var value = new RegExp('^' + req.body.search, "i")
        if (!req.body.fromDate && req.body.toDate) {
            return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
        }

        else if (req.body.fromDate && !req.body.toDate) {
            return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
        }

        else {
            if (req.body.bookingStatus && req.body.fromDate && req.body.toDate && req.body.search) {
                obj = {
                    $or: [{ $and: [query, { bookingStatus: req.body.bookingStatus }, { eventName: value }] }, { $and: [query, { bookingStatus: req.body.bookingStatus }, { customerName: value }] }, { $and: [query, { bookingStatus: req.body.bookingStatus }, { businessName: value }] }]
                }
            }
            else if (!req.body.bookingStatus && req.body.fromDate && req.body.toDate && req.body.search) {
                obj = {
                    $or: [{ $and: [query, { eventName: value }] }, { $and: [query, { customerName: value }] }, { $and: [query, { businessName: value }] }]
                }
            }

            else if (req.body.bookingStatus && req.body.fromDate && req.body.toDate && !req.body.search) {
                obj = {
                    $or: [{ $and: [query, { bookingStatus: req.body.bookingStatus }] }, { $and: [query, { bookingStatus: req.body.bookingStatus }] }, { $and: [query, { bookingStatus: req.body.bookingStatus }] }]
                }
            }

            else if (req.body.bookingStatus && !req.body.fromDate && !req.body.toDate && req.body.search) {
                obj = {
                    $or: [{ $and: [{ bookingStatus: req.body.bookingStatus }, { eventName: value }] }, { $and: [{ bookingStatus: req.body.bookingStatus }, { customerName: value }] }, { $and: [{ bookingStatus: req.body.bookingStatus }, { businessName: value }] }]
                }
            }

            else if (!req.body.bookingStatus && !req.body.fromDate && !req.body.toDate && req.body.search) {
                obj = {
                    $or: [{ $and: [{ eventName: value }] }, { $and: [{ customerName: value }] }, { $and: [{ businessName: value }] }]
                }
            }

            else if (req.body.bookingStatus && !req.body.fromDate && !req.body.toDate && !req.body.search) {
                obj = {
                    bookingStatus: req.body.bookingStatus
                }
            }

            else if (!req.body.bookingStatus && req.body.fromDate && req.body.toDate && !req.body.search) {
                obj = query;
            }
            else
                obj = {};
        }

        booking.paginate(obj, options, (err, data) => {
            if (err) {
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.INTERNAL_SERVER_ERROR);
            }
            if (data.docs.length == 0) {
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND);
            }
            else {
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, data.docs, { total: data.total, limit: data.limit, currentPage: data.page, totalPage: data.pages });
            }
        })
    },

}
