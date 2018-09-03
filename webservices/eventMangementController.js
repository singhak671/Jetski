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
const keyPublishable = 'pk_test_NkhYVArGE07qHgai7PuO6Bbm';
const keySecret = 'sk_test_4Sht4ZSKz8eUDCaiXP5pGfs6';
const stripe = require("stripe")(keySecret);
const notification = require('../common_functions/notification');
const Noti = require('../models/notificationModel');
var userSchema = require("../models/userModel");
const cron = require('node-cron');
const asyncLoop = require('node-async-loop');
//var userSchema = require("../models/userModel");
moment().format();

function joinDateTime(d, t, offset) {
    // console.log('d==>>', d + " t==>>>"+t);
    var dateString = d + " " + t,
        dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = (dateTimeParts[0].split('-')).reverse(),
        date;
    //     console.log("dateTimeParts==>>", dateTimeParts);
    //     console.log("timeParts==>>", timeParts);
    //     console.log("dateParts==>>", dateParts);
    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    //     console.log('date==>>' + date);

    //     console.log(date.getTime()); //1379426880000
    //     console.log(date);
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


    'addEvent': (req, res) => {
        // console.log("addddddddddddd", req.body);
        console.log("***@@@@@@@@@@@@@@@@", req.body);

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
                    console.log("successss>>>>>>>", succ1);
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
                        // console.log("@@@@@@@@@@@@@@@@@.")
                        return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please provide correct duration time");
                    }
                    else {
                        // console.log("&&&&&&&&&&&&&&&&&&&&&.")
                        business.save((err2, createEvent) => {
                            if (err2) {
                                console.log("business added error>>>>>>>>>>>", err2)
                                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
                            }
                            else if (createEvent) {
                                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.", createEvent);
                                User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { services: { eventId: createEvent._id, eventIdStatus: createEvent.eventStatus } } }, { new: true }, (err3, success) => {
                                    console.log("success", success)
                                    if (err3)
                                        console.log(err3)
                                    if (!success)
                                        console.log("cannot update userId with the event update")
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


    //-------------------------------------------------------------------------------All Event at business site before login-----------------------------------------------------------------//
    'allEvent': (req, res) => {
        //console.log("get al customer")
        var query = {};
        let options = {
            page: req.params.pageNumber,
            select: 'eventAddress duration  eventImage eventName eventDescription eventPrice ',
            limit: 5,
            //sort: ,
            //password:0,
            lean: false,
            //populate: { path: 'userId', select: 'profilePic name' },
        }

        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                console.log("result is" + JSON.stringify(result))
                result.map(x => delete x['password'])
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result);
            }
        })
        // })
    },

    //-------------------------------------------------------------------------------Describe  particular event after login-----------------------------------------------------------------//

    "eventDescription": (req, res) => {

        console.log('request is', req.body);
        var event_id = req.body._id;
        // var description = [];
        var related_event = [];
        var data = {};
        waterfall([
            function (callback) {
                eventSchema.findOne({ '_id': event_id }).exec((err, succ) => {
                    if (err)
                        response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                    else if (succ) {
                        data.description = succ;
                        callback(null, 'done');
                    }
                })
            },
            function (arg1, callback) {
                eventSchema.find({}).sort({ eventCreated_At: -1 }).limit(5).exec((err, succ) => {
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
    //=============================================================cancel booking for app=======================================================
    'cancelBooking': (req, res) => {
        var query = { _id: req.body._id, $or: [{ bookingStatus: "PENDING" }, { bookingStatus: "CONFIRMED" }] }
        booking.findOneAndUpdate(query, { $set: { bookingStatus: "CANCELLED" } }, { new: true }, (err, result) => {
            console.log("**********************", err, result)
            if (err) {
                console.log("err1,", err)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            }
            if (!result)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Data not found")
            else {

                var result = result;
                userSchema.find({ _id: result.userId, status: "ACTIVE" }, (err_, result_) => {
                    if (err_)
                        return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else {
                        //  }
                        var amount = ((90 * result.eventPrice) / 100)
                        return stripe.refunds.create({
                            charge: result.chargeId,
                            amount: Math.round(amount),//((90* result.eventPrice)/100),
                        }, function (err, refund) {
                            if (err) {
                                console.log("err in refunds", err)
                            }
                            else {
                                console.log('success refund-->', refund)
                                //callback('',refund)
                                // console.log("Noti data", result_.deviceToken, 'Booking Cancelled!!', ' Your booking is Cancelled and your amount will be refunded...!', result.businessManId, result.userId, result_.profilePic, result_.name)
                                // notification.single_notification(result_.deviceToken, 'Booking Cancelled!!', ' Your booking is Cancelled and your amount will be refunded...!', result.businessManId, result.userId, result_.profilePic, result_.name)
                                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "booking cancelled successfully and your amount will be refunded...")
                            }
                        })
                        //   .then((refund)=>{
                        //     return  stripe.refunds.retrieve(
                        //        req.body.refundId,// "re_1D1XeJHvBDdKnKYwXMjS4nTM",
                        //         function(err, refund1) {
                        //             if(err)
                        //                 console.log("error---->",err)
                        //             else{
                        //                 console.log("Success refundsss---->",refund1)
                        //                // callback('',refund1)
                        //             //    notification.single_notification(result_.deviceToken, 'Booking Cancelled!!',' Your booking is Cancelled and your amount will be refunded...!', result.businessManId,result.userId)
                        //             //    response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK,"booking cancelled successfully.")
                        //             }
                        //           //asynchronously called
                        //         }
                        //       );
                        //   })
                        // notification.single_notification(result_.deviceToken, 'Booking Cancelled!!',' Your booking is Cancelled and your amount will be refunded...!', result.businessManId,result.userId)
                        // response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK,"booking cancelled successfully.")
                    }
                })

            }
        })
    },
    //-------------------------------------------------------------------------------alllatestEvent for app site as well as business website----------------------------------------------------------------//




    'latestEvents': (req, res) => {
        //console.log("get al customer")
        //var durationArr = [];
        var doc_arr = [];
        var result_new;
        var query = { status: "ACTIVE" };
        let options = {
            page: req.body.pageNumber || 1,
            select: 'period eventAddress eventCreated_At eventImage offset duration eventName status eventDescription eventPrice ',
            // limit: req.body.limit || 5,
            // match:{query},
            sort: { eventCreated_At: -1 },
            populate: { path: 'userId', select: 'profilePic businessName name status', match: { status: "ACTIVE" } },
            lean: true
        }
        //success
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

                        //callback(null, result);
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
    // need custom paginations
    'myAllEvents': (req, res) => {
        //console.log("get al customer")


        var query = { $or: [{ userId: req.body.userId, period: req.body.period, status: "ACTIVE" }, { userId: req.body.userId, status: "ACTIVE" }] }
        let options = {
            // page: req.params.pageNumber,
            select: 'period eventAddress eventCreated_At eventImage offset duration eventName userId status eventDescription eventPrice ',
            limit: req.body.limit || 10,
            page: req.body.pageNumber || 1,
            // match:{query},
            sort: { eventCreated_At: -1 },
            populate: {
                path: 'services.eventId', select: 'eventAddress duration  eventImage eventCreated_At  eventName eventDescription period eventPrice ',

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
                console.log("result is" + JSON.stringify(result))
                // response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });

            }
        })
    },





    //------------------------------------------------------------------------------- API for Filter location in app   -----------------------------------------------------------------//
    "eventLocation": (req, res) => {
        eventSchema.find({ status: "ACTIVE" }).lean().exec((error, result) => {
            console.log("==", result.length)
            var eventAddressArr = [];
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (result.length == 0)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {

                console.log('Result is=====>>>>>', result);
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
        console.log("array=====>>>", req.body)
        let list = req.body.eventAddress.map((x) => x.eventAddress)
        let query = { eventAddress: { $in: list }, status: "ACTIVE" }
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

                        //callback(null, result);
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
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventImage eventPrice createdAt" },
            { path: "userId", select: "profilePic name" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage " },
            { path: "userId", select: "profilePic name" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
                console.log("result====>", JSON.stringify(result))
                // notification.single_notification(token, 'Booking Confirmation!!', 'Your Booking is Confirmed...!', req.body.userId,result.userId)
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
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage " },
            { path: "userId", select: "profilePic name" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage " },
            { path: "userId", select: "profilePic name" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
            // select: 'status  eventPrice  eventStatus  eventCreated_At  _id   eventName eventAddress eventDescription eventImage  ',
            limit: 10,
            sort: { createdAt: -1 },
            lean: true,
            populate: [{ path: 'businessManId', select: 'profilePic  name' }, { path: "eventId", select: "status  eventCreated_At _id eventName eventAddress eventDescription eventPrice eventImage createdAt" }]

        }
        booking.paginate(query, options, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (result.docs.length == 0)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else {
                // delete result[0]["id"];
                //  result.map(x => delete x['id'])
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });

            }
        })
    },

    //------------------------------------------------------------------------------- API for filter >>PENDING for business   -----------------------------------------------------------------//


    "filterEventsPending": (req, res) => {
        // var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "PENDING", period: req.body.period }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus eventCreated_At _id  eventName eventAddress eventDescription eventImage createdAt" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
        var query = { businessManId: req.body.userId, bookingStatus: "CONFIRMED", period: req.body.period }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus eventCreated_At _id  eventName eventAddress eventDescription eventPrice eventImage createdAt" }],
            //select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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
        console.log("event status request " + req.body.bookingId)
        booking.findByIdAndUpdate({ _id: req.body.bookingId }, { $set: { bookingStatus: "CONFIRMED" } }, { new: true }).populate({ path: "userId", select: "deviceToken name profilePic" }).exec((error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                var result = result
                console.log(`confirm event status result------------->${JSON.stringify(result)}`)
                var event;
                eventSchema.findById({ _id: result.eventId, status: "ACTIVE" }).exec((err_, result_) => {
                    if (err_)
                        response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else {
                        console.log(`confirm event status result_------------->${JSON.stringify(result_)}`)

                        event = result_.eventName;
                        console.log(result.userId.deviceToken, 'Event Confirmation!!', event + ' Event is Confirmed...!', result.businessManId, result.userId._id, result.userId.profilePic, result.userId.name)
                        notification.single_notification(result.deviceToken, 'Event Confirmation!!', event + ' Event is Confirmed...!', result.businessManId, result.userId._id, result.userId.profilePic, result.userId.name)
                        response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is confirmed")
                    }
                })

            }

        })
    },




    //------------------------------------------------------------------------------- API for Reject individual in business site   -----------------------------------------------------------------//




    "rejectEventStatus": (req, res) => {
        console.log("event status request for cancel " + req.body.bookingId)
        booking.findByIdAndUpdate({ _id: req.body.bookingId }, { $set: { bookingStatus: "CANCELLED" } }, { new: true }).populate({ path: "userId", select: "deviceToken name profilePic" }).exec((error, result) => {
            if (error)
                response.sendResponseWithData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG, error)
            else if (!result)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND, result)
            else {
                var result = result
                console.log(`cancel event status result------------->${JSON.stringify(result)}`)
                var event;
                eventSchema.findById({ _id: result.eventId, status: "ACTIVE" }, (err_, result_) => {
                    if (err_)
                        response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else {
                        console.log(`cancel event status result_------------->${JSON.stringify(result_.eventName)}`)
                        console.log("Pppopdfufydfsjuysdfjfdgs", result.chargeId, result.eventPrice)
                        event = result_.eventName;
                        console.log("event0-00---", event)
                        return stripe.refunds.create({
                            charge: result.chargeId,
                            amount: (result.eventPrice),
                        }, function (err, refund) {
                            if (err) {
                                console.log("err in refunds", err)
                                notification.single_notification(result.deviceToken, 'Payment Issue Occur', event + 'Error occur during payment as the amount has already been refunded. ', result.businessManId, result.userId._id, result.userId.profilePic, result.userId.name)
                                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Error occur during payment as the amount has already been refunded.")
                            }
                            else {
                                console.log('success refund-->', refund)
                                console.log('noti result==========>', result.deviceToken, 'Event Cancelled!!', event + ' Event is Cancelled...!', result.businessManId, result.userId._id, result.userId.profilePic, result.userId.name)
                                notification.single_notification(result.deviceToken, 'Event Cancelled!!', event + ' Event is Cancelled...!', result.businessManId, result.userId._id, result.userId.profilePic, result.userId.name)
                                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is cancelled")
                            }

                        })

                    }
                })

            }
        })
    },



    //-------------------------------------------------------------------------------  Business filter at website DAILY/WEEKLY/MONTHLY  -----------------------------------------------------------------//


    "filterEvent": (req, res) => {

        var date = new Date();
        var newDate = date.toJSON()
        var array = newDate.split("T")[0];
        var newDate1 = array + " 00:00:00"
        var d = new Date(newDate1)
        var Time_stamp = d.getTime();
        var nextWeek = new Date(Time_stamp + 7 * 24 * 60 * 60 * 1000);


        let todayArray = [];
        let weekArray = [];
        let monthlyArray = [];
        let query = {
            page: req.body.page || 1,
            limit: req.body.limit || 10
        }

        User.findOne({ _id: req.body.userId, status: "ACTIVE" })
            .populate({
                path: "services.eventId",
                match: { period: req.body.period }
            })
            .skip((query.page - 1) * query.limit)
            // .limit(query.limit)
            .exec((err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
                if (!success)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found.");
                else {
                    //  console.log(success)
                    //=========================FOR DAILY=============================
                    if (req.body.period == "DAILY") {
                        for (let x = 0; x < success.services.length; x++)
                            if (success.services[x].eventId) {
                                for (var i = 0; i < success.services[x].eventId.duration.length; i++) {
                                    // console.log('TIME STAMP VALUE',Time_stamp);
                                    // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);
                                    // console.log('SUCCESS +++++++++',success.duration[i].date.epoc * 1000 == Time_stamp);
                                    if (success.services[x].eventId.duration[i].date.epoc * 1000 == Time_stamp) {
                                        todayArray.push(success.services[0].eventId.duration[i])
                                        // console.log('ARRAY IS', todayArray);

                                    }

                                }
                                success.services[x].eventId.duration = todayArray;
                            }

                        return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, success);

                    }
                    //=========================FOR WEEKLY=============================
                    else if (req.body.period == "WEEKLY") {
                        var current_date = Date.now();
                        var newDate = nextWeek.toJSON()
                        var array = newDate.split("T")[0]
                        var newDate1 = array + " 00:00:00"
                        var d = new Date(newDate1)
                        var Time_stamp2 = d.getTime();
                        // console.log('NEXT WEEK DATA IS',Time_stamp2);
                        for (let x = 0; x < success.services.length; x++)
                            if (success.services[x].eventId) {
                                for (var i = 0; i < success.services[x].eventId.duration.length; i++) {
                                    // console.log('TIME STAMP VALUE',Time_stamp2);
                                    // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);


                                    if (success.services[x].eventId.duration[i].date.epoc * 1000 < Time_stamp2 && success.services[x].eventId.duration[i].date.epoc * 1000 >= Time_stamp) {
                                        weekArray.push(success.duration[i])
                                        console.log('ARRAY IS', weekArray);

                                    }
                                    success.services[x].eventId.duration = weekArray;
                                }
                                return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", success);

                            }
                    }
                    //=========================FOR MONTHLY=============================
                    else if (req.body.period == "MONTHLY") {

                        var current_date = new Date();
                        var current_month = current_date.getMonth() + 1;
                        var current_year = current_date.getFullYear();
                        var number_of_days = new Date(current_year, current_month, 0).getDate();
                        var nextMonth = new Date(Time_stamp + number_of_days * 24 * 60 * 60 * 1000);

                        for (let x = 0; x < success.services.length; x++)
                            if (success.services[x].eventId) {
                                for (var i = 0; i < success.services[x].eventId.duration.length; i++)
                                    // console.log('TIME STAMP VALUE',Time_stamp2);
                                    // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);


                                    if (success.services[x].eventId.duration[i].date.epoc * 1000 < nextMonth && success.services[x].eventId.duration[i].date.epoc * 1000 >= Time_stamp) {
                                        monthlyArray.push(success.duration[i])
                                        console.log('ARRAY IS', monthlyArray);

                                    }
                                success.services[x].eventId.duration = monthlyArray;
                            }

                        return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", success);

                    }

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
        var nextWeek = new Date(Time_stamp + 7 * 24 * 60 * 60 * 1000);


        let todayArray = [];
        let weekArray = [];
        let monthlyArray = [];

        eventSchema.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (err, success) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
            if (!success)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Data not found.", success);
            else {
                console.log("success===" + JSON.stringify(success))
                //  console.log(success)
                //=========================FOR DAILY=============================

                if (req.body.period == 'DAILY') {

                    for (var i = 0; i < success.duration.length; i++) {
                        // console.log('TIME STAMP VALUE',Time_stamp);
                        // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);
                        // console.log('SUCCESS +++++++++',success.duration[i].date.epoc * 1000 == Time_stamp);
                        if (success.duration[i].date.epoc * 1000 == Time_stamp) {
                            todayArray.push(success.duration[i])
                            console.log('ARRAY IS for Today>>>>>', todayArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", todayArray);


                }
                //=========================FOR WEEKLY=============================
                else if (req.body.period == 'WEEKLY') {
                    var current_date = Date.now();
                    var newDate = nextWeek.toJSON()
                    var array = newDate.split("T")[0]
                    var newDate1 = array + " 00:00:00"
                    var d = new Date(newDate1)
                    var Time_stamp2 = d.getTime();
                    // console.log('NEXT WEEK DATA IS',Time_stamp2);

                    for (var i = 0; i < success.duration.length; i++) {
                        // console.log('TIME STAMP VALUE',Time_stamp2);
                        // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);


                        if (success.duration[i].date.epoc * 1000 < Time_stamp2 && success.duration[i].date.epoc * 1000 >= Time_stamp) {
                            weekArray.push(success.duration[i])
                            console.log('ARRAY IS for weekly>>>', weekArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", weekArray);

                }
                // =========================FOR MONTHLY=============================
                else if (req.body.period == 'MONTHLY') {
                    var current_date = new Date();
                    var current_month = current_date.getMonth() + 1;
                    var current_year = current_date.getFullYear();
                    var number_of_days = new Date(current_year, current_month, 0).getDate();
                    var nextMonth = new Date(Time_stamp + number_of_days * 24 * 60 * 60 * 1000);
                    for (var i = 0; i < success.duration.length; i++) {
                        // console.log('TIME STAMP VALUE',Time_stamp2);
                        // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);


                        if (success.duration[i].date.epoc * 1000 < nextMonth && success.duration[i].date.epoc * 1000 >= Time_stamp) {
                            monthlyArray.push(success.duration[i])
                            console.log('ARRAY IS for monthly>>', monthlyArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", monthlyArray);

                }

            }
        })


    },
    //====================================================================================================================================================
    'booking': (req, res) => {
        if (!req.body) {
            return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
        }
        else {
            User.findOne({ _id: req.body.userId, userType: "CUSTOMER", status: "ACTIVE" }, (err4, succ) => {
                //  User.findOne({ "_id": req.body.companyId, "status": "ACTIVE" }, (err_, result_) => {
                console.log("err result--->", err4, succ)
                if (err4)
                    return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err4);
                if (!succ)
                    return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
                else {//
                    var email = succ.email
                    async.waterfall([(callback) => {
                        eventSchema.findOne({ _id: req.body.eventId }, (err5, succ1) => {//
                            if (err5)
                                return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
                            if (!succ1) {
                                // console.log("successss>>>>>>>", succ1);
                                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "eventId Not found");
                            }
                            else {
                                var array = [];
                                array = req.body.duration[0].times;
                                if (array.length == 1) {
                                    if (validateEvent(req.body.duration, req.body.offset)) {
                                        // transactionDate , transactionTime , transactionTimestamp, buninesNname , eventName, customerName. are required ** //

                                        // booking.findOne({ eventId: req.body.eventId, userId: req.body.userId, businessManId: req.body.businessManId }, (err, success) => {
                                        //     console.log("booking result---------->", err, success)
                                        //     if (err)
                                        //         return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err)
                                        // if (!success) {

                                        //     return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Data not found", success)
                                        // }
                                        // else {
                                        //     booking.create(req.body, (err, result) => {
                                        //         if (err)
                                        //             return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err);
                                        //         else
                                        //             console.log("booking is done>>>>>>>>>>>>", result)
                                        //         // response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, success);


                                        //     })
                                        // }
                                        //})
                                    }
                                    else
                                        return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Booking time expired..");

                                }
                                else
                                    return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Multiple time slot are not allowed");
                                callback(null, succ1)
                            }
                        })//
                    }, (data, callback) => {
                        var charge1;
                        console.log("34yswqghasgghsghas")
                        stripe.customers.create({
                            email: email, // customer email, which user need to enter while making payment
                            source: req.body.stripeToken // token for the given card 
                        }).then((customer) => {
                            console.log("customer stripe")
                            if (!customer)
                                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, " No such token.... ")
                            else {
                                return stripe.charges.create({ // charge the customer
                                    amount: req.body.eventPrice,
                                    currency: "usd",
                                    customer: customer.id
                                })
                            }

                            console.log("customer=====>", customer)
                        })
                            .then((charge) => {
                                charge1 = charge
                                console.log("charge stripe")
                                if (!charge1) {

                                    console.log("Cannot charge a customer that has no active card", charge1.id)
                                    response.sendResponseWithoutData(res, responseCode.WENT_WRONG, "Your card is not active.")
                                }
                                else {
                                    console.log("charge1============>", charge1.id)
                                    // var book=new booking({
                                    //     "transactionDate":charge1.Date,
                                    //     "transactionStatus":charge1.Status

                                    // })
                                    // book.save((err_,result_)=>{
                                    // booking.findOneAndUpdate({ eventId: req.body.eventId, userId: req.body.userId, businessManId: req.body.businessManId, period: req.body.period }, {
                                    //     $set: {
                                    //       //  "transactionDate": charge1.Date,
                                    //         "transactionStatus": charge1.Status,
                                    //         "chargeId":charge1.id
                                    //     }
                                    // }, { multi: true },








                                    var obj = {
                                        eventId: req.body.eventId,
                                        userId: req.body.userId,
                                        businessManId: req.body.businessManId,
                                        period: req.body.period,
                                        duration: req.body.duration,
                                        offset: req.body.offset,
                                        eventName: req.body.eventName,
                                        businessName: req.body.businessName,
                                        customerName: req.body.customerName,
                                        "transactionDate": req.body.transactionDate,
                                        "transactionTime": req.body.transactionTime,
                                        "transactionTimeStamp": req.body.transactionTimeStamp,
                                        "transactionStatus": charge1.Status,
                                        "chargeId": charge1.id,
                                        "bookingStatus": "PENDING",
                                        "eventPrice": req.body.eventPrice
                                    }
                                    booking.create(obj, (err_, result_) => {
                                        if (err_)
                                            console.log("err", err_)
                                        else {
                                            console.log("*************************result_", JSON.stringify(result_))
                                            console.log(`Charge object is ${JSON.stringify(charge1)}`)
                                            callback('', result_)
                                        }
                                    })

                                    // charge=charge;

                                    //  response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, 'Payment done successfully.')  
                                }
                            })//.then(()=>{
                        //************************************************--------  Refund Payment  ----*********************************************************************************** */
                        // if(req.body.refund=="REFUND"){
                        // console.log("customer id------------->",charge)
                        // return stripe.refunds.create({
                        //     charge: "ch_1D1Z4yFvUkcGB9taxetGm3Gd"
                        //   }, function(err, refund) {
                        //       if(err){
                        //           console.log("err in refunds",err)
                        //       }
                        //       else{
                        //           console.log('refund-->',refund)
                        //           callback('',refund)
                        //       }
                        //     // asynchronously called
                        //   }).then((refund)=>{
                        //     return  stripe.refunds.retrieve(
                        //         "re_1D1XeJHvBDdKnKYwXMjS4nTM",
                        //         function(err, refund1) {
                        //             if(err)
                        //                 console.log("error---->",err)
                        //             else{
                        //                 console.log("refundsss---->",refund1)
                        //                 callback('',refund1)
                        //             }
                        //           //asynchronously called
                        //         }
                        //       );

                        //   })
                        //}
                        //*********************************************----------  Refund Payment End -----------***************************************************                          

                        //  })
                        // .catch((err)=>{
                        //     if(!err){
                        //         console.log("err occur",err) 
                        //     }
                        //     else{
                        //         console.log("err occur",err)
                        //         callback(err)
                        //        // response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured",err)
                        //     }

                        // })
                        //   callback(!charge,charge)

                    },], (err, result) => {
                        if (err) {
                            console.log("errr6", err)
                            response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
                        } else {
                            console.log("*********result final", result)
                            notification.single_notification(succ.deviceToken, 'booking Posted !', ' Your booking is successfully done.', req.body.businessManId, req.body.userId, succ.profilePic, succ.name)
                            response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Payment successfully done!")
                        }

                    })
                }//
            })
        }
    },


    /////////////////////////////////////////////////////////////////////////////------API for booking in APP--------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // 'booking': (req, res) => {
    //     if (!req.body) {
    //         return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
    //     }
    //     User.findOne({ _id: req.body.userId, userType: "CUSTOMER", status: "ACTIVE" }, (err4, succ) => {
    //         if (err4)
    //             return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
    //         if (!succ)
    //             return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
    //         eventSchema.findOne({ _id: req.body.eventId }, (err5, succ1) => {//
    //             if (err5)
    //                 return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
    //             if (!succ1) {
    //                 // console.log("successss>>>>>>>", succ1);
    //                 return response.sendResponseWithData(res, responseCode.NOT_FOUND, "eventId Not found");
    //             }
    //             else {
    //                 var array = [];
    //                 array = req.body.duration[0].times;
    //                 if (array.length == 1) {
    //                     if (validateEvent(req.body.duration,req.body.offset)) {
    //                         booking.findOne({ eventId: req.body.eventId, userId: req.body.userId, businessManId: req.body.businessManId, period: req.body.period }, (err, success) => {
    //                             if (err)
    //                                 return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err)
    //                             else {
    //                                 booking.create(req.body, (err, success) => {
    //                                     if (err)
    //                                         return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err);
    //                                     else
    //                                         response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, success);

    //                                 })
    //                             }
    //                         })
    //                     }
    //                     else
    //                         return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please choose valid time slot");

    //                 }
    //                 else
    //                     return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Multiple time slot are not allowed");
    //             }
    //         })//
    //     })
    // },
    //    ********************************************************************************************** My all booking in app *********************************************************************************
    "myBookingShow": (req, res) => {
        var query = { userId: req.body.userId }
        // console.log("++++++++++++++++", query)
        booking.find({ userId: req.body.userId }, { eventId: 1, duration: 1, _id: 0 }).populate("eventId", { duration: 0, userId: 0 }).populate("userId", { name: 1, profilePic: 1 }).exec((error, result) => {
            if (error)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, result)
        })
    },


    //********************************************************************************************  API for addCustomerFeedback  for App **************************************************************************  */

    "addCustomerFeedback": (req, res) => {
        if (!req.body.eventId || !req.body.businessManId || !req.body.customerId)
            return response.sendResponseWithoutData(res, responseCode.BAD_REQUEST, "Please provide all required fields !");
        else
            User.findOne({ _id: req.body.businessManId, businessName: req.body.businessName, _id: req.body.customerId, status: "ACTIVE" }, (err, success) => {
                if (err)
                    return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG);
                else if (success == false)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "UserId Not found");
                else{
                    eventSchema.findOne({ _id: req.body.eventId, businessName: req.body.businessName, status: "ACTIVE" }, (err, success2) => {
                        console.log("in events------->>",err, success2)
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
                                        // console.log("noti data===>", success.deviceToken, 'feedback Posted !', ' Your feedback is successfully send.', req.body.businessManId, req.body.customerId, success.profilePic, success.name)
                                        // notification.single_notification(success.deviceToken, 'feedback Posted !', ' Your feedback is successfully send.', req.body.businessManId, req.body.customerId, success.profilePic, success.name)
                                        response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Feedback is successfully send.", success3);
                                    }

                                })
                    })
                }
                    
            })
    },
    //********************************************************************************************  API for viewCustomerFeedback  for App **************************************************************************  */

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
                    // succ=succ.feedback.pop()
                 
                    response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, succ);
                }
            })
        }
    },



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
        console.log(`request for avg rating of particular customer ${JSON.stringify(req.body)}`)
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
    //********************************************************************************************  API for viewCustomerFeedback  for website **************************************************************************  */

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

    //********************************************************************************************  API for getting all events for Admin panel **************************************************************************  */


    'getAllEvents': (req, res) => {
        var n=req.body.pageNumber || 1  , m=10
        var value = new RegExp('^' + req.body.search, "i")
        //     if (req.body.search) {
    
        //     }
        var query = {
            $or: [{ $and: [{ status: "ACTIVE" }, { "businessName": value }] }, { $and: [{ status: "ACTIVE" }, { eventName: value }] }], status: "ACTIVE"
        }
        // $and: [{ name: req.body.search},{email: req.body.search} ,{userType: 'CUSTOMER' }] }
        var options = {
           
            // page: req.body.pageNumber || 1,
            select: '_id eventName eventImage businessName eventCreated_At eventPrice',
            populate: [{ path: "userId", select: " status name ", match: { status: "ACTIVE" } }],
            //  match:{userId},
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
                // console.log('result is=====>>>>',JSON.stringify(result));

                var arr = result.docs.filter((x) => {
                    if (x.userId != null)
                        return x;
                })

                console.log('Array is=====>>>>>>',JSON.stringify(arr));
               
                var userList1 = arr.slice((n- 1) * m, n* m)

                //var userList1 = arr.slice((pageNumber - 1) * limit, pageNumber* limit)
                 console.log("custom pagination>>>>>>>>>>>>>",JSON.stringify(userList1))
                 var x={"total": arr.length,
                 "limit": 10,
                 "currentPage": n,
                 "totalPage": Math.ceil(arr.length/10)}
                 console.log("total===.",x)
                  response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, userList1, x);

            }
           
        })
    },

   

    //********************************************************************************************  API transaction management >>> Admin panel **************************************************************************  */

    "transactionManagementFilter": (req, res) => {
        console.log("request is-------------->", req.body);
        let options = {
            page: req.body.pageNumber || 1,
            limit: req.body.limit || 10,
            select: "transactionStatus bookingStatus eventName  eventPrice customerName businessName transactionDate transactionTime",
            sort: { createdAt: -1 },
            lean: false
        }
        var obj;
        // var date1 = new Date(req.body.fromDate);
        // var date2 = new Date(req.body.toDate);
        var query = { transactionDate: { $gte: req.body.fromDate, $lte: req.body.toDate } }
        console.log("QUERY is-----", query);
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
