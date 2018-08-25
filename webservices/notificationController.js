const User = require('../models/userModel');
const response = require('../common_functions/response_handler');
const resCode = require('../helper/httpResponseCode');
const resMessage = require('../helper/httpResponseMessage'); 
const noti = require('../common_functions/notification');
const Notification = require('../models/notificationModel');
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
let subscribers = [];
//console.log("Public key",vapidKeys.publicKey)
//'BDO0P...eoH'
//api key=========>AIzaSyDGSrq0YF5pF0uhXtZx2D8IMxCkgl2hbO4
//console.log("private key",vapidKeys.privateKey)
// let VAPID_SUBJECT = 'dhfjd';
// let VAPID_PUBLIC_KEY = vapidKeys.publicKey;
// let VAPID_PRIVATE_KEY = vapidKeys.privateKey;
// webpush.setVapidDetails(
//     VAPID_SUBJECT,
//     VAPID_PUBLIC_KEY,
//     VAPID_PRIVATE_KEY
// );
//'3J303..r4I'
const notiApi = {
    'saveToken': (req, res) => {
        if(!req.body)
            response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, resMessage.WENT_WRONG);
        else{
            User.findByIdAndUpdate({_id:req.body._id,status:"ACTIVE"},{$set:{deviceToken:req.body.deviceToken,deviceType:req.body.deviceType}},{new:true},(error,result)=>{
                if(error)
                    response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
                else if(!result)
                    response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.NOT_FOUND)
                else
                    response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, 'Token updated successfully.')
            })
        }
    },

//=========================================== For web-push ==================================================================
    // 'subscribe':  (req, res)=> {
    //     let endpoint = req.body['notificationEndPoint'];
    //     let publicKey = req.body['publicKey'];
    //     let auth = req.body['auth'];
    //     let options = {
    //         endpoint: endpoint,
    //         keys: {
    //             p256dh: publicKey,
    //             auth: auth
    //         }
    //     };
    //     User.findByIdAndUpdate({_id:req.body._id,status:"ACTIVE"},{$set:{pushSubscription:options}},{new:true},(error,result)=>{
    //         if(error){
    //             console.log("error---------->",error)
    //             response.sendResponseWithoutData(res, resCode.SOMETHING_WENT_WRONG, resMessage.INTERNAL_SERVER_ERROR);
    //         }
              
    //         else if(!result)
    //             response.sendResponseWithoutData(res, resCode.WENT_WRONG, resMessage.NOT_FOUND)
    //         else{
    //             console.log("result of subscription========>",result)
    //             response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, 'Subscription accepted!')
    //         }
               
    //     })
    // },
//================================Notification shown in web===============================================================
'notificationList': (req, res) => {
    console.log(`Request for notification list ${JSON.stringify(req.body)}`)
    let options = {
        page: req.body.pageNumber,
        limit:10,
        sort: { createdAt: -1 }
    };
    Notification.paginate({"bussinessId.bid":req.body.bussinessId,noti_type:'CUSTOMER'}, options, (error, result)=>{
        if(error)
            response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
        else{
            console.log("noti list===>",JSON.stringify(result))
            response.sendResponseWithPagination(res, resCode.EVERYTHING_IS_OK, 'Notifications found successfully.', result.docs, { total: result.total, limit: result.limit, currentPage: result.page, totalPage: result.pages })
        }       
    })
},
'unreadCount': (req, res) =>{
    console.log(`Request for unread notification count ${req.params.bussinessId}`)
    Notification.count({"bussinessId.bid":req.params.bussinessId,noti_type:'CUSTOMER',"bussinessId.isRead":false}, (error,result)=>{
        if(error)
            response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
        else    
            response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Unread count found successfully.', result);
    })
},
'updateReadStatus': (req, res) => {
    console.log(`Request for unread notification count -> ${req.params.bussinessId}`)
    Notification.updateMany({"bussinessId.bid":req.params.bussinessId,noti_type:'CUSTOMER'},{$set:{"bussinessId.isRead":true}}, (error,result)=>{
        if(error)
            response.sendResponseWithoutData(res, resCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR)
        else if(result.matchedCount == result.modifiedCount) {
            console.log("***************************",result.matchedCount,result.modifiedCount)
            response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', 0);
        }   
        else
            response.sendResponseWithData(res, resCode.EVERYTHING_IS_OK, 'Read status updated successfully.', result.matchedCount-result.modifiedCount);
    })
},
  //=======================================push=================================================  
    // 'push': function(req, res) {
    //     console.log("request for push-------->",JSON.stringify(req.body))
    //     console.log("inside push")
    //     const subscription = {
    //         endpoint: req.body.endpoint,
    //         keys: {
    //           auth: req.body.auth,
    //           p256dh: req.body.p256dh
    //         }
    //       };
    //     // const subscription = {
    //     //     endpoint: "https://android.googleapis.com/gcm/send/",
    //     //     //https://fcm.googleapis.com/fcm/send/{registrationId}
    //     //     keys: {
    //     //         "p256dh":
    //     //         "BIPUL12DLfytvTajnryr2PRdAgXS3HGKiLqndGcJGabyhHheJYlNGCeXl1dn18gSJ1WAkAPIxr4gK0_dQds4yiI=",
    //     //             "auth":"FPssNDTKnInHVndSTdbKFw=="
    //     //     //   auth: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    //     //     //  p256dh: 'Fg5t8...2rC'
    //     //     }
    //     //   }
    //     //   const subscription = {
    //     //     userVisibleOnly: true,
    //     //     applicationServerKey: urlBase64ToUint8Array(
    //     //       'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    //     //     )
    //     //   };//req.body.subscription;
    //     const message = req.body.message;
    //     //setTimeout(() => {
    //       const options = {
    //         gcmAPIKey: 'AIzaSyBhBx_hxg8QUCbjo_D3gb-dHFY_APurdl8',
    //         TTL: 24 * 60 * 60,
    //         vapidDetails: {
    //           subject: 'mailto:sender@example.com',
    //           publicKey: 'BDqxMfc7QPfi5AFUMvO8ciGMsTSWIVzcPvPUZvEhH33Z8iS2br8lLBIHkQfhcqElyy2GAk11UxIFlVQhJzzK34U',//vapidKeys.publicKey,
    //           privateKey: 'yS4QUTovZQASwXRx9IiVBXLnIkFl9-Q70AO3lMgDrs0'//vapidKeys.privateKey
    //         },
    //       }
    //   try{ console.log("**********************************")
    //      webpush.sendNotification(
    //         subscription,
    //     message,
    //     options
    //   );
    // }catch(err){
    //     console.log("err",err)
    //   }
    //     //}, 0);
    // //   console.log("Everything is ok !!!")
    //     // response.send('OK');
    //   },
}

module.exports = notiApi;