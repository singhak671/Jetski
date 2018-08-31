var FCM = require('fcm-push');
var apn = require('apn');
var Client = require('node-rest-client').Client;
const Noti = require('../models/notificationModel');
const User = require('../models/userModel'); 
const mongoose = require('mongoose');
const waterfall = require('async-waterfall');
const notification = require('../common_functions/notification');
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
let subscribers = [];
// console.log("Public key",vapidKeys.publicKey)
//'BDO0P...eoH'
//api key=========>AIzaSyDGSrq0YF5pF0uhXtZx2D8IMxCkgl2hbO4
// console.log("private key",vapidKeys.privateKey)
// const webpush = require('web-push');
// const vapidKeys = webpush.generateVAPIDKeys()

// console.log("Public key",vapidKeys.publicKey)
// //'BDO0P...eoH'

// console.log("private key",vapidKeys.privateKey)
// //'3J303..r4I'


var notifications = {
//=====================================Notification for bussiness panel=========================================
// 'push': function(req, res) {
//     const subscription = req.param('subscription');
//     const message = req.param('message');
  
//     setTimeout(() => {
//       const options = {
//         TTL: 24 * 60 * 60,
//         vapidDetails: {
//           subject: 'mailto:sender@example.com',
//           publicKey: process.env.VAPID_PUBLIC_KEY,
//           privateKey: process.env.VAPID_PRIVATE_KEY
//         },
//       }
  
//       webpush.sendNotification(
//         subscription,
//         message,
//         options
//       );
  
//     }, 0);
//   console.log("Everything is ok !!!")
//     // response.send('OK');
//   },
    
//====================================Notification for app====================================================================
    'single_notification': (token,title,msg,bussinessId,customerId,image,name) => {
        console.log(`Notification api hit`)
        var client = new Client();
        //var idArr = ['ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg','cOAjo2t143Q:APA91bErtsPQhPEhKeepyMQKihPMkOROAPP3RRduDJKzLLzlUNAATCrIRyW10dUa3JZ8zK1rRaIeeMqeNbNuS4PWy_0p9HcKA41k8MkbeQjdYUy--7_gNV13yIFM93IzHwBh5G3FAwk1LK2-XIzPBEzMVRNdf6ZYcA'];
        // idArr[0] = token;
        // set content-type header and data as json in args parameter
        var args = {
            data: { 
                "notification":{
                    "title":title,
                    "body":msg,
                    "sound":"default",
                    "click_action":"FCM_PLUGIN_ACTIVITY",
                    //"color":"#00ff00",
                    "icon":"icon"
                  },
                  "data":{
                    "param1":bussinessId,
                    "param2":"valdfgdfgdfue2",
                  },
                    // "to":"ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg",
                    "to":token,
                    //"registration_ids": idArr,
                    "priority":"high",
                    "restricted_package_name":""
             },
            headers: { "Content-Type": "application/json", 
                        "Authorization":"key=AAAARpGrUOI:APA91bG8gyXxS6RpMzYKI_O_yCCZsuvy56AYTmzA4Hk1jVamkG_i43EkpH04Is2M9sIvP_rlMZ3i5WVb8xfBlzRQ-Fu-xphIZbey6znFDmLjQKw74P8bwXdpPppOUxe-maDVupUMSo1n"
                     }
        };
        
        client.post("https://fcm.googleapis.com/fcm/send", args, function (data, response) {
            // parsed response body as js object
            console.log("in post===>",JSON.stringify(data))
            if(data.success){
                console.log(`Object of noti ${JSON.stringify(data)}`);
                let obj = {
                    customerId:[{cid:customerId},{image:image},{name:name}],
                    bussinessId:{bid:bussinessId},
                    noti_type: 'CUSTOMER', 
                    content: msg
                };
                let noti  = new Noti(obj);
                noti.save((er1,ress)=>{
                    console.log(`Error is ${JSON.stringify(er1)}   result is ${JSON.stringify(ress)}`)
                    //response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, 'Order has been placed successfully and confirmation code send to your mobile number.',result)
                })
            }else{
                console.log(`Object of noti ${JSON.stringify(data)}`);
            }
            // raw response
            //console.log(response);
        });
    },
//=======================================================Notification by fcm================================================================
'single_notificationForWeb': (token,title,msg,bussinessId,customerId) => {
    console.log(`Notification api hit`)
    var client = new Client();
    //var idArr = ['ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg','cOAjo2t143Q:APA91bErtsPQhPEhKeepyMQKihPMkOROAPP3RRduDJKzLLzlUNAATCrIRyW10dUa3JZ8zK1rRaIeeMqeNbNuS4PWy_0p9HcKA41k8MkbeQjdYUy--7_gNV13yIFM93IzHwBh5G3FAwk1LK2-XIzPBEzMVRNdf6ZYcA'];
    // idArr[0] = token;
    // set content-type header and data as json in args parameter
    var args = {
        data: { 
            "notification":{
                "title":title,
                "body":msg,
                "sound":"default",
                "click_action":"FCM_PLUGIN_ACTIVITY",
                //"color":"#00ff00",
                "icon":"icon"
              },
              "data":{
                "param1":bussinessId,
                "param2":"valdfgdfgdfue2",
              },
                // "to":"ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg",
                "to":token,
                //"registration_ids": idArr,
                "priority":"high",
                "restricted_package_name":""
         },
        headers: { "Content-Type": "application/json", 
                    "Authorization":"key=AAAARpGrUOI:APA91bG8gyXxS6RpMzYKI_O_yCCZsuvy56AYTmzA4Hk1jVamkG_i43EkpH04Is2M9sIvP_rlMZ3i5WVb8xfBlzRQ-Fu-xphIZbey6znFDmLjQKw74P8bwXdpPppOUxe-maDVupUMSo1n"
                 }
    };
    
    client.post("https://fcm.googleapis.com/fcm/send", args, function (data, response) {
        // parsed response body as js object
        console.log("in post===>",JSON.stringify(data))
        if(data.success){
            console.log(`Object of noti ${JSON.stringify(data)}`);
            let obj = {
                customerId:[{cid:customerId}],
                bussinessId:{bid:bussinessId},
                noti_type: 'BUSSINESS', 
                content: msg
            };
            let noti  = new Noti(obj);
            noti.save((er1,ress)=>{
                console.log("noti api hit")
                console.log(`Error is ${JSON.stringify(er1)}   result is ${JSON.stringify(ress)}`)
                //response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, 'Order has been placed successfully and confirmation code send to your mobile number.',result)
            })
        }else{
            console.log(`Object of noti ${JSON.stringify(data)}`);
        }
        // raw response
        //console.log(response);
    });
},

//============================================ Notification for web push ====================================================================
'push': (title,body,subscription1,email,bussinessId)=> {
    //console.log("request for push-------->",JSON.stringify(req.body))
    console.log("inside push")
    const subscription=subscription1;
    const message = {
        title: title,
       // 'icon': req.body.icon,
        body: body,
       // 'url': req.body.link
      };//req.body.message;
    // payload: JSON.stringify({
    //     'title': req.body.title,
    //     'icon': req.body.icon,
    //     'body': req.body.body,
    //     'url': req.body.link
    //   }),
    const options = {
        gcmAPIKey: 'AIzaSyBhBx_hxg8QUCbjo_D3gb-dHFY_APurdl8',
        TTL: 24 * 60 * 60,
        vapidDetails: {
          subject: email,//req.body.email,//'mailto:sender@example.com',
          publicKey: 'BDqxMfc7QPfi5AFUMvO8ciGMsTSWIVzcPvPUZvEhH33Z8iS2br8lLBIHkQfhcqElyy2GAk11UxIFlVQhJzzK34U',//vapidKeys.publicKey,
          privateKey: 'yS4QUTovZQASwXRx9IiVBXLnIkFl9-Q70AO3lMgDrs0'//vapidKeys.privateKey
        },
      }
      console.log("%%%%%%%%%%%%%%%%%%",subscription,')))))))))))))))))',message,"^^^^^^^^^^^^^^^^^^",options)
            let obj = {
              //  userIds: ids.map(x =>  {let obj={uid:x}; return obj}),
                bussinessId:{bid:bussinessId},
                noti_type: 'BUSSINESS', 
                content: message.body
            };
           // let noti  = new Noti(obj);
            var webNoti=new Noti(obj)
            webNoti.save((err,result)=>{
               if(err) 
               console.log("err occur",err)
                else{
                    console.log("result saved",result)
                    return  webpush.sendNotification(subscription,message,options);
                    console.log("web api hit............")
                }
            })
            //response.sendResponseWithoutData(res, resCode.EVERYTHING_IS_OK, 'Notification send')       
    }

// 'notificationForWeb': (pushSubscription,title,msg,bussinessId) => {
//     console.log(`web noti api hit`)
//     console.log("request for push-------->",JSON.stringify(req.body))
//         console.log("inside push")
//         const message = 'Notificartion for bussiness',//req.body.message;
//         var subscription;
//         const options = {
//             gcmAPIKey: 'AIzaSyBhBx_hxg8QUCbjo_D3gb-dHFY_APurdl8',
//             TTL: 24 * 60 * 60,
//             vapidDetails: {
//               subject: req.body.email,//'mailto:sender@example.com',
//               publicKey: 'BDqxMfc7QPfi5AFUMvO8ciGMsTSWIVzcPvPUZvEhH33Z8iS2br8lLBIHkQfhcqElyy2GAk11UxIFlVQhJzzK34U',//vapidKeys.publicKey,
//               privateKey: 'yS4QUTovZQASwXRx9IiVBXLnIkFl9-Q70AO3lMgDrs0'//vapidKeys.privateKey
//             },
//           }
       
// }, 

}

module.exports = notifications;