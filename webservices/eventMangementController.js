var mongoose = require('mongoose');
var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var paginate = require('mongoose-paginate');
var cloudinary = require("../common_functions/uploadImage.js");
var each = require('async-each-series');
var eventSchema = require('../models/eventManagementModel');
var moment = require('moment');
var User = require("../models/userModel.js");
var booking = require("../models/bookingModel.js")
const waterfall = require('async-waterfall')
//var userSchema = require("../models/userModel");
moment().format();

function joinDateTime(d, t) {
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
    var finalObj = { dateTime: date.getTime() }
    return finalObj;
}

function validateEvent(duration) {
    var eventShowTimeArr = [];
    duration.map(x =>
        x.times.map(y => eventShowTimeArr.push(joinDateTime(x.date.formatted, y.time)))
    )

    var currentTime = new Date().getTime();
    var index = eventShowTimeArr.findIndex(z => (z.dateTime - currentTime) <= 0);

    if (index != -1) {
        return false;
    } else {
        return true;
    }
}


module.exports = {


    'addEvent': (req, res) => {
        // console.log("addddddddddddd", req.body);

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
                    var valid = validateEvent(durationArr);
                    if (!valid) {
                        console.log("Please madam sahi data bhej do.")
                        return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please provide correct duration time");
                    }
                    else {
                        console.log("Wahh Gauri Ma'am ab sahi data bheji ho.")
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


    'latestEvent': (req, res) => {
        //console.log("get al customer")
        var query = {};
        let options = {
            // page: req.params.pageNumber,
            select: 'period eventAddress eventCreated_At eventImage duration eventName status eventDescription eventPrice ',
            limit: 5,
            sort: { eventCreated_At: -1 },
            //password:0,
            lean: false,
            populate: { path: 'userId', select: 'profilePic name' },
        }
        //success
        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                console.log("result is" + JSON.stringify(result))
                result.docs.map(x => delete x['password'])
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result);
            }
        })
        // })
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
        //success
        // User.findById(req.body.userId, (err4, succ) => {
        //     if (err4)
        //         return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
        //     if (!succ)
        //         return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
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
                eventSchema.find({}).limit(5).exec((err, succ) => {
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

    //-------------------------------------------------------------------------------alllatestEvent for app site----------------------------------------------------------------//


    'latestEvents': (req, res) => {
        //console.log("get al customer")
        var query = {};
        let options = {
            // page: req.params.pageNumber,
            select: 'period eventAddress eventCreated_At eventImage duration eventName status eventDescription eventPrice ',
            limit: 5,
            sort: { eventCreated_At: -1 },
            populate: { path: 'userId', select: 'profilePic name' },
            lean: false
        }
        //success
        eventSchema.paginate(query, options, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            else if (result.docs.length == 0)
                response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                console.log("result is" + JSON.stringify(result))
                result.docs.map(x => delete x['password'])
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result);
            }
        })
        // })
    },



    //-------------------------------------------------------------------------------My Event at business site after login for myBooking App -----------------------------------------------------------------//


    'myAllEvents': (req, res) => {
        //console.log("get al customer")
        var query = {};
        var limit = 5;
        var page = (req.body.page === undefined) ? 1 : req.body.page;

        console.log("succ in populate")
        if (req.body.period)
            query.period = req.body.period

        // $or: { asdfasdf, asdfasdfadsfds, { $and: { asdfasdfadsf, asdfasdfasdfadsf } } }

        User.find({ $or: [{ _id: req.body.userId, period: req.body.period, status: "ACTIVE" }, { _id: req.body.userId, status: "ACTIVE" }] }, { services: 1 }).populate({
            path: 'services.eventId',
            // model:"Businesses",
            match: query,
            select: 'eventAddress duration  eventImage eventName eventDescription period eventPrice ',

        }).sort({ created_At: -1 }).limit(limit).skip(limit * (page - 1)).exec((error, result) => {
            if (error) {
                console.log("err-->" + error)
                response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
            }

            // else if (result.docs.length == 0)
            //  response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                console.log("i am here>>>>>>>>>>>>", JSON.stringify(result))
                //result.docs.map(x => delete x['password'])
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
                // response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
            }
            // })

            //}
        })


    },


    //------------------------------------------------------------------------------- API for Filter location in app   -----------------------------------------------------------------//
    "eventLocation": (req, res) => {
        eventSchema.distinct("eventAddress", (error, result) => {
            console.log("==", result.length)
            var jsonObj = [];
            for (var i = 0; i < result.length; i++) {
                jsonObj.push({ "eventAddress": result[i] });
            }
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, jsonObj)
        })
    },

    //------------------------------------------------------------------------------- API for location choose in app   -----------------------------------------------------------------//


    "locationDetail": (req, res) => {
        var temp_data = {};
        console.log("array=====>>>", req.body)
        let list = req.body.eventAddress.map((x) => x.eventAddress)
        let query = { eventAddress: { $in: list } }
        eventSchema.find(query).populate("userId", { name: 1, profilePic: 1 }).exec((error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else {
                temp_data.docs = result
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, temp_data)
            }
        })
    },


    //------------------------------------------------------------------------------- API for Pending in business site   -----------------------------------------------------------------//


    "eventsPending": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "PENDING" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventImage createdAt" },
            { path: "userId", select: "profilePic name" }],
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



    //------------------------------------------------------------------------------- API for AllConfirm in business site   -----------------------------------------------------------------//


    "eventsConfirmed": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "CONFIRMED" }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus  eventCreated_At _id period eventName eventAddress eventDescription eventImage " }],
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



    //------------------------------------------------------------------------------- API for myAllBooking for APP   -----------------------------------------------------------------//


    "myBooking": (req, res) => {
        var query = {}
        let options = {
            page: req.params.pagenumber,
            select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage  ',
            limit: 10,
            sort: { eventCreated_At: -1 },
            lean: false,
            populate: { path: 'userId', select: 'profilePic name' },

        }
        User.findOne({ _id: req.body.userId, status: "ACTIVE" }, (err_1, result) => {
            if (err_1)
                return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            if (!result)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found")
            else
                eventSchema.paginate(query, options, (error, result) => {
                    if (error)
                        return response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
                    else if (!result)
                        return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
                    else
                        response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
                })
        })
    },

    "filterEventsPending": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "PENDING", period: req.body.period }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus eventCreated_At _id period eventName eventAddress eventDescription eventImage createdAt" }],
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



    "filterEventsConfirm": (req, res) => {
        var arr = []
        var query = { businessManId: req.body.userId, bookingStatus: "CONFIRMED", period: req.body.period }
        let options = {
            page: req.body.pageNumber || 1,
            populate: [{ path: "eventId", select: "status eventStatus eventCreated_At _id period eventName eventAddress eventDescription eventPrice eventImage createdAt" }],
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
        console.log("event status request " + req.body.eventId)
        booking.findByIdAndUpdate({ eventId: req.body.eventId }, { $set: { bookingStatus: "CONFIRMED" } }, { new: true }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is confirmed")
        })
    },




    //------------------------------------------------------------------------------- API for Reject individual in business site   -----------------------------------------------------------------//




    "rejectEventStatus": (req, res) => {
        console.log("event status request " + req.body.eventId)
        booking.findByIdAndUpdate({ eventId: req.body.eventId }, { $set: { bookingStatus: "REJECTED" } }, { new: true }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is rejected")
        })
    },



    //------------------------------------------------------------------------------- Filter DAILY/WEEKLY/MONTHLY for Business Website  -----------------------------------------------------------------//


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

        User.findOne({ _id: req.body.userId })
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
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "User not found.");
                else {
                    //  console.log(success)
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




    //------------------------------------------------------------------------------- API for booking Event for App  -----------------------------------------------------------------//


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

        eventSchema.findOne({ _id: req.body.userId }, (err, success) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
            if (!success)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found.");
            else {
                console.log("success===" + JSON.stringify(success))


                if (req.body.period == 'DAILY') {

                    for (var i = 0; i < success.duration.length; i++) {
                        // console.log('TIME STAMP VALUE',Time_stamp);
                        // console.log('DATA EPOC IS',success.duration[i].date.epoc*1000);
                        // console.log('SUCCESS +++++++++',success.duration[i].date.epoc * 1000 == Time_stamp);
                        if (success.duration[i].date.epoc * 1000 == Time_stamp) {
                            todayArray.push(success.duration[i])
                            console.log('ARRAY IS', todayArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", todayArray);





                }

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
                            console.log('ARRAY IS', weekArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", weekArray);

                }
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
                            console.log('ARRAY IS', monthlyArray);

                        }
                    }
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Data found successfully", monthlyArray);

                }

            }
        })


    },



    /////////////////////////////////////////////////////////////////////////////------APP booking--------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    'booking': (req, res) => {
        if (!req.body) { 
            return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
        }
        User.findOne({ _id: req.body.userId, userType: "CUSTOMER", status: "ACTIVE" }, (err4, succ) => {
            if (err4)
                return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
            if (!succ)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
            eventSchema.findOne({ _id: req.body.eventId }, (err5, succ1) => {
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
                        if (validateEvent(req.body.duration)) {
                            booking.findOne({ eventId: req.body.eventId, userId: req.body.userId, businessManId: req.body.businessManId ,period:req.body.period }, (err, success) => {
                                if (err)
                                    return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err);
                                else if (success) {
                                    success.duration.push(req.body.duration);
                                    success.save((err, success1) => {
                                        if (success1)
                                            response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, success1);
                                    })
                                }
                                else {
                                    booking.create(req.body, (err, success) => {
                                        if (err)
                                            return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err);
                                        else
                                            response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, success);

                                    })
                                }
                            })
                        }
                        else
                            return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Please choose valid time slot");

                    }
                    else
                        return response.sendResponseWithData(res, responseCode.NOT_FOUND, "Multiple time slot are not allowed");
                }
            })
        })
    },
    //////////////////////////////////  My all booking in app        /////////////////////////////
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



}





