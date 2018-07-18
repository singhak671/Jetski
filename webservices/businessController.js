var mongoose = require('mongoose');
var response = require('../common_functions/response_handler');
var responseMessage = require('../helper/httpResponseMessage');
var responseCode = require('../helper/httpResponseCode');
//var businessSchema = require("../models/businessModel");
var paginate = require('mongoose-query-paginate');
var cloudinary = require("../common_functions/uploadImage.js");
var each = require('async-each-series');
//const waterfall = require('async-waterfall');
var businessSchema= require('../models/businessModel');
//const async = require('async');

module.exports = {
    'addEvent': (req, res) => {
      //  console.log("addddddddddddd", req.body);
        
        if(!req.body){
            response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA)
        }
        else{
            cloudinary.uploadImage(req.body.eventImage, (err, result) => {
                if(err)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
            else if(result ){
                    req.body.eventImage = result
                    var business = new businessSchema(req.body)
                    business.save((err2, createEvent) => {
                        if (err2) {
                            console.log("business added error>>>>>>>>>>>", err2)
                            response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.")
                        }
                        else if (createEvent) {
                            console.log(createEvent)
                            response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "Event saved successfully.")
                        }
                        else
                            response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!")
                    })
                }                   
            })
        }
    },

}



