const StaticContent = require('../models/termsAndPrivacyModel');
const Response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage');

const staticApi = {

 //-----------------------------------------------------------Content update API --------------------------------------------------------------------------//

    'updateStatic': (req, res) => {
        if (!req.body)
            Response.sendResponseWithoutData(res, resCode.BAD_REQUEST, resMessage.BAD_REQUEST)
        else {
            StaticContent.findOneAndUpdate({}, req.body, { new: true },
                (error, result) => {
                    if (error)
                        Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
                    else if (!result)
                        Response.sendResponseWithoutData(res, resCode.NOT_FOUND, "This id does not exist.")
                    else
                        Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Content data upload successfully", result)
                })
        }
    },

    //-----------------------------------------------------------Static API --------------------------------------------------------------------------//
    'getStaticContent': (req, res) => {
        StaticContent.find((error, result) => {
            if (error)
                Response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR)
            else if (result.length == 0)
                Response.sendResponseWithoutData(res, resCode.NOT_FOUND, 'No staic content found.')
            else
                Response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, "Static content found successfully.", result);
        })
    }
}

module.exports = staticApi;