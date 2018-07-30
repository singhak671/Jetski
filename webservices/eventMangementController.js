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

        User.findById(req.body.userId, (err4, succ) => {
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


    // 'latestEvent': (req, res) => {
    //     //console.log("get al customer")
    //     var query = {};
    //     let options = {
    //        // page: req.params.pageNumber,
    //         select: 'period eventCreated_At profileImage eventImage duration eventName status country eventPrice ',
    //         limit:5,
    //         sort: { eventCreated_At: -1 },
    //         //password:0,
    //         lean: false
    //     }
    //     // eventSchema.findOne({ _id: req.body.userId }, (err, success) => {
    //     //             if(err)
    //     //             return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
    //     //         if(!success)
    //     //         return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found.");
    //           //success
    //             eventSchema.paginate( query, options, (error, result) => {
    //             if (error)
    //             response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR)
    //             else if (result.docs.length == 0)
    //             response.sendResponseWithData(res, responseCode.NOT_FOUND, responseMessage.NOT_FOUND)
    //             else {
    //                 console.log("result is" + JSON.stringify(result))
    //                 result.docs.map(x => delete x['password'])
    //                 response.sendResponseWithPagination(res, responseCode.EVERYTHING_IS_OK, responseMessage.SUCCESSFULLY_DONE, result.docs);
    //             }
    //         })
    //     // })
    // },


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


    "bookingEvent": (req, res) => {
        console.log("@$@^&%@&*@*&^@^@((@",req.body);
        eventSchema.findOne({ _id: req.body.userId }, (err, success) => {
            if (err)
                return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
            if (!success)
                return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found.");
            //success
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today1 = yyyy + '-' + mm + '-' + dd;//2018-07-27
            var date1 = new Date(today1)

            
            //    var Data =req.body.duration[0].date;
            var Data = success.duration;


             var dateToday = new Date(Date.now());
             console.log("@@@@@@@@@@@@@@@@",dateToday);
            dateToday.setHours(0,0,0,0);
           var dateLast = new Date(Date.now());
           dateLast.setHours(23,59,59,999);

console.log("!!!!!!!!!!!!!!!!!!",dateToday,dateLast);

            let arr = [];

            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);

            var a = lastDay.toString();
            lastDay = a.split(" ");

            var currentDate = new Date();


            var daily = {
                _id: mongoose.Types.ObjectId(req.body.userId),
                'duration.date.jsdate':{$gte:dateToday}
            }

            var weekly = {
                _id: req.body.userId,
                $gte: {
                    'duration.date.jsdate': Date.now() + 19800000
                },
                $lte: {
                    'duration.date.jsdate': currentDate.setDate(currentDate.getDate() + 6) + 19800000
                }
            }

            var monthly = {
                _id: req.body.userId,
                $gte: {
                    'duration.date.jsdate': Date.now() + 19800000
                },
                $lte: {
                    'duration.date.jsdate': currentDate.setDate(currentDate.getDate() + 31) + 19800000
                }
            }



            // for (let i = 0; i < Data.length; i++) {

            //     console.log("aa gya===>>", Data[i])
            //     if (new Date(Data[i].date.formatted).getTime() >= date1.getTime())
            //         arr.push(Data[i])

            // }
            console.log("QUERY FOR DAILY ===>", daily);
            eventSchema.find(daily,(err1, succ) => {
                console.log("result for duration correction>>>>>>>>>.",err1,succ)
                if (err1)
                    return response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.");
                if (!succ)
                    return response.sendResponseWithoutData(res, responseCode.NOT_FOUND, "Data not found.");
                else {
                    return response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, succ);
                }
            })
            // "DAILY","MONTHLY","WEEKLY"
        })
    }
}





