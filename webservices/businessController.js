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
    'addBusiness': (req, res) => {
      //  console.log("addddddddddddd", req.body);
        
        if(!req.body.businessName || !req.body.businessImage){
            response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, responseMessage.REQUIRED_DATA)
        }
        else{
        cloudinary.uploadImage(req.body.businessImage, (err, result) => {
            if(err)
            Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
           else if(result ){
                req.body.businessImage = result
                var business = new businessSchema(req.body)
                business.save((err2, createbusiness) => {
                    if (err2) {
                        console.log("business added error>>>>>>>", err2)
                        response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.")
                    }
                    else if (createbusiness) {
                        console.log(createbusiness)
                        response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "business saved successfully.")
                    }
                    else
                        response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!")
                })
            }
                
        })
    }
            



            // console.log("in else....")
            // var data = req.body
            // var imageArray = [], counter = 0;
            // each(req.body.businessImage, (item, next) => {
            //     console.log("ist imag")
            //     counter++;
            //     cloudinary.uploadImage(item, (err, result) => {
            //         console.log("in image")
            //         // if(err)
            //         //     response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.")
            //         // else{
                        
            //         // }
            //         imageArray[imageArray.length] = result
            //         if (req.body.businessImage.length == counter) {
            //             req.body.businessImage = imageArray
            //                     var business = new businessSchema(req.body)
            //                     business.save((err2, createbusiness) => {
            //                         if (err2) {
            //                             console.log("business added error>>>>>>>", err2)
            //                             response.sendResponseWithoutData(res, responseCode.INTERNAL_SERVER_ERROR, "Error Occured.")
            //                         }
            //                         else if (createbusiness) {
            //                             console.log(createbusiness)
            //                             response.sendResponseWithoutData(res, responseCode.EVERYTHING_IS_OK, "business saved successfully.")
            //                         }
            //                         else(!createbusiness)
            //                             response.sendResponseWithoutData(res, responseCode.SOMETHING_WENT_WRONG, "Error !!!")
            //                     })
            //         } else {
            //             next();
            //                }
            //     }), (finalResult) => {
            //                          }
            // })
    },

}



