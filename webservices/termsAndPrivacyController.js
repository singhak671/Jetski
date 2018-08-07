const StaticContent = require('../models/termsAndPrivacyModel');
const Response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage');

const staticApi = {
    // 'saveStatic': (req, res) => {
    //     if(!req.body)
    //         Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, "Please give all required data.")
    //     else{
    //         static = new StaticContent(req.body);
    //         static.save((error, result)=>{
    //             if(error)
    //                 Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
    //             else    
    //                 Response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, req.body.termsAndConditions?"Terms and Conditions saved successfully.":"Privacy policy saved successfully.");
    //         })
    //     }
    // },
    'updateStatic': (req, res) => {
        if(!req.body)
            Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, resMessage. BAD_REQUEST)
        else{
            StaticContent.findByIdAndUpdate({_id:req.body._id},{$set:{
                "termsAndConditions":req.body.termsAndConditions,
                "aboutUs": req.body.aboutUs,
                "privacyPolicy": req.body.privacyPolicy
            }},{new:true},
            (error,result)=>{
                if(error)
                    Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                else if(!result)
                    Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "This id does not exist.")
                else 
                    Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Content data upload successfully",result)
            })
        }
    },
    'getStaticContent': (req, res) => {
        StaticContent.find((error,result)=>{
            if(error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
            else if(result.length==0)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, 'No staic content found.')
            else
                Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Static content found successfully.", result);
        })
    }
}

module.exports = staticApi;