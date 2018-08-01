var mongoose = require('mongoose');
var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
var paginate = require('mongoose-query-paginate');
var cloudinary = require("../common_functions/uploadImage.js");
var each = require('async-each-series');
var eventSchema = require('../models/eventManagementModel');
var moment = require('moment');
var User = require("../models/userModel.js");
//var userSchema = require("../models/userModel");
moment().format();

module.exports = {

    'addEvent': (req, res) => {
        //  console.log("addddddddddddd", req.body);
        console.log("i am here>>>>>>>>", req.body)
        if (!req.body) {
            return response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA);
        }
        User.findOne({ _id: req.body.userId, status: "ACTIVE" }, (err4, succ) => {
            // User.findById(req.body.userId, (err4, succ) => {
            if (err4)
                return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err3);
            if (!succ)
                return response.sendResponseWithData(res, responseCode.NOT_FOUND, "UserId not found");
            eventSchema.findOne({ userId: req.body.userId, eventName: req.body.eventName }, (err5, succ1) => {
                if (err5)
                    return response.sendResponseWithData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err5);
                if (succ1) {
                    // console.log("successss>>>>>>>", succ1);
                    return response.sendResponseWithData(res, responseCode.BAD_REQUEST, "Event name already exists");
                }
                var base64 = req.body.eventImage
                cloudinary.uploadImage(base64, (err, result) => {
                    if (result) {
                        req.body.eventImage = result;
                    }
                    var business = new eventSchema(req.body)
                    business.save((err2, createEvent) => {
                        if (err2) {
                            // console.log("business added error>>>>>>>>>>>", err2)
                            response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.", err2)
                        }
                        else if (createEvent) {

                            response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.", createEvent);
                            // console.log("fgfgjgdfjgdfgh", createEvent)
                            // console.log("please check", createEvent._id)
                            // console.log("push value", { $push: { eventId: createEvent._id } })
                            // console.log("userid", { _id: req.body.userId })
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { eventId: createEvent._id } }, { new: true }, (err3, success) => {
                                // console.log("success", success)
                                if (err3)
                                    console.log(err3)
                                if (!success)
                                    console.log("cannot update userId with the event update")
                            })
                        }
                        else
                            response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!", err2)
                    })
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
                result.docs.map(x => delete x['password'])
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result);
            }
        })
        // })
    },

    //-------------------------------------------------------------------------------alllatestEvent for app site-----------------------------------------------------------------//


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
                response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result);
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


        // $or: { asdfasdf, asdfasdfadsfds, { $and: { asdfasdfadsf, asdfasdfasdfadsf } } }

        User.findOne({ $and: [{ _id: req.body.userId, period: req.body.period }] }, { $or: [{ _id: req.body.userId, status: "ACTIVE" }] }).populate({
            path: 'eventId',
            select: 'eventAddress duration  eventImage eventName eventDescription period eventPrice '
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



    // 'myAllEvents': (req, res) => {
    //     //console.log("get al customer")
    //     var query = {};
    //     var limit = 5;
    //     var page = (req.body.page === undefined) ? 1 : req.body.page;

    //     console.log("succ in populate")


    //         // $or: { asdfasdf, asdfasdfadsfds, { $and: { asdfasdfadsf, asdfasdfasdfadsf } } }

    //         User.findOne({ $or:[{ _id: req.body.userId, status: "ACTIVE"},
    //         { $and:[ { _id: req.body.userId, period: req.body.period } ]}]}).populate({ path: 'eventId', 
    //             select: 'eventAddress duration  eventImage eventName eventDescription period eventPrice '}).sort({ created_At: -1 }).limit(limit).skip(limit * (page - 1)).exec((error, result) => {
    //             if (error) {
    //                 console.log("err-->" + error)
    //                 response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
    //             }

    //             // else if (result.docs.length == 0)
    //             //  response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
    //             else {
    //                 console.log("i am here>>>>>>>>>>>>", JSON.stringify(result))
    //                 //result.docs.map(x => delete x['password'])
    //                 response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
    //                 // response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });
    //             }
    //             // })

    //             //}
    //         })


    // },

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
        console.log("array=====>>>", req.body)
        let list = req.body.eventAddress.map((x) => x.eventAddress)
        let query = { eventAddress: { $in: list } }
        eventSchema.find(query, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result)
        })
    },


    //------------------------------------------------------------------------------- API for Pending in business site   -----------------------------------------------------------------//


    "eventsPending": (req, res) => {
        var query = { eventStatus: "PENDING" }
        let options = {
            page: req.body.pageNumber,
            select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
            limit: 10,
            sort: { eventCreated_At: -1 },
            lean: false
        }
        User.findOne({ _id: req.body.userId, status: "ACTIVE" }, (err_1, result) => {
            if (error)
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
                    // Response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, resMessage.SUCCESSFULLY_DONE, result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages });

                })
        })



    },


    //------------------------------------------------------------------------------- API for AllConfirm in business site   -----------------------------------------------------------------//


    "eventsConfirmed": (req, res) => {
        var query = { eventStatus: "CONFIRMED" }
        let options = {
            page: req.params.pagenumber,
            select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
            limit: 10,
            sort: { eventCreated_At: -1 },
            lean: false
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


    //------------------------------------------------------------------------------- API for myAllBooking for APP   -----------------------------------------------------------------//


    "myBooking": (req, res) => {
        var query = {}
        let options = {
            page: req.params.pagenumber,
            select: 'status eventStatus duration eventCreated_At _id userId period eventName eventAddress eventDescription eventImage createdAt updatedAt',
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




    //------------------------------------------------------------------------------- API for Pending individual in business site   -----------------------------------------------------------------//



    "eventBookNow": (req, res) => {
        console.log("event status request " + req.body._id)
        eventSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { eventStatus: "PENDING" } }, { new: true }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is on pending")
        })
    },



    //------------------------------------------------------------------------------- API for Confirm individual in business site   -----------------------------------------------------------------//





    "confirmEventStatus": (req, res) => {
        console.log("event status request " + req.body._id)
        eventSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { eventStatus: "CONFIRMED" } }, { new: true }, (error, result) => {
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
        console.log("event status request " + req.body._id)
        eventSchema.findByIdAndUpdate({ _id: req.body._id }, { $set: { eventStatus: "REJECTED" } }, { new: true }, (error, result) => {
            if (error)
                response.sendResponseWithoutData(res, responseCode.WENT_WRONG, responseMessage.WENT_WRONG)
            else if (!result)
                response.sendResponseWithoutData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
            else
                response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event status is rejected")
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


    }


}
