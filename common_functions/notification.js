var apn = require("apn");
var FCM = require('fcm-push'); 
var options = {
        "cert": "MobiloitteEnterpriseDistribution.pem",
        "key": "MobiloitteEnterpriseDistribution.pem",
        "passphrase": "Mobiloitte1", //Acropole
        "gateway": "gateway.sandbox.push.apple.com",
        "port": 2195,
        "enhanced": true,
        "cacheLength": 5,
        production:true
};
var Client = require('node-rest-client').Client;
const Noti = require('../models/notificationModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const waterfall = require('async-waterfall');
const notification = require('../common_functions/notification');
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
let subscribers = [];



var notifications = {
    

 'iosPush': (deviceToken, title, message, data)=> {
    console.log("deviceToken", deviceToken)
    var apnConnection = new apn.Connection(options);
    var myDevice = new apn.Device(deviceToken);
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = title + ' ' + message;
    note.payload = data
    try {
        apnConnection.pushNotification(note, myDevice); //devicIos
        apnConnection.on('transmitted', function(note, deviceToken) {
            console.log('APNS: Successfully transmitted message' + JSON.stringify(note));
        });
    } catch (ex) {
        console.log("in Error");
        console.log(ex);
    }
},
    //====================================Notification for app====================================================================
    'single_notification': ( title, msg, bussinessId, customerId, image, name) => {
        console.log(`Notification api hit`)
        var client = new Client();
        //var idArr = ['ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg','cOAjo2t143Q:APA91bErtsPQhPEhKeepyMQKihPMkOROAPP3RRduDJKzLLzlUNAATCrIRyW10dUa3JZ8zK1rRaIeeMqeNbNuS4PWy_0p9HcKA41k8MkbeQjdYUy--7_gNV13yIFM93IzHwBh5G3FAwk1LK2-XIzPBEzMVRNdf6ZYcA'];
        // idArr[0] = token;
        // set content-type header and data as json in args parameter
        var args = {
            data: {
                "notification": {
                    "title": title,
                    "body": msg,
                    "sound": "default",
                    "click_action": "FCM_PLUGIN_ACTIVITY",
                    //"color":"#00ff00",
                    "icon": "icon"
                },
                "data": {
                    "param1": bussinessId,
                    "param2": "valdfgdfgdfue2",
                },
                // "to":"ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg",
                "to": "token",
                //"registration_ids": idArr,
                "priority": "high",
                "restricted_package_name": ""
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAARpGrUOI:APA91bG8gyXxS6RpMzYKI_O_yCCZsuvy56AYTmzA4Hk1jVamkG_i43EkpH04Is2M9sIvP_rlMZ3i5WVb8xfBlzRQ-Fu-xphIZbey6znFDmLjQKw74P8bwXdpPppOUxe-maDVupUMSo1n"
            }
        };

        client.post("https://fcm.googleapis.com/fcm/send", args, function (data, response) {
            console.log("___________inside client post", data)
            // parsed response body as js object
            // console.log("in post===>",JSON.stringify(data))
            console.log("data.success------->>", data)
            if (data) {
                console.log(`Object of noti 1${JSON.stringify(data)}`);
                let obj = {
                    customerId: { cid: customerId, image: image, name: name },
                    bussinessId: { bid: bussinessId },
                  
                    // noti_type: 'CUSTOMER',//.......
                   
                    noti_type: 'BUSINESS',
                    content: msg
                };
                console.log(":::::::::::::::::::::::::", obj)
                let noti = new Noti(obj);
                console.log("******", noti)
                noti.save((er1, ress) => {
                    console.log(`Error is ${JSON.stringify(er1)}   result is noti ${JSON.stringify(ress)}`)
                    //response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, 'Order has been placed successfully and confirmation code send to your mobile number.',result)
                })
            } else {
                console.log(`Object of noti 2${JSON.stringify(data)}`);
            }
            // raw response
            //console.log(response);
        });
    },
    //=======================================================Notification by fcm================================================================
    'single_notificationForWeb': (token, title, msg, customerId, image, name) => {
        console.log(`Notification api hit`)
        var client = new Client();
        //var idArr = ['ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg','cOAjo2t143Q:APA91bErtsPQhPEhKeepyMQKihPMkOROAPP3RRduDJKzLLzlUNAATCrIRyW10dUa3JZ8zK1rRaIeeMqeNbNuS4PWy_0p9HcKA41k8MkbeQjdYUy--7_gNV13yIFM93IzHwBh5G3FAwk1LK2-XIzPBEzMVRNdf6ZYcA'];
        // idArr[0] = token;
        // set content-type header and data as json in args parameter
        var args = {
            data: {
                "notification": {
                    "title": title,
                    "body": msg,
                    "sound": "default",
                    "click_action": "FCM_PLUGIN_ACTIVITY",
                    //"color":"#00ff00",
                    "icon": "icon"
                },
                "data": {
                    "param1": 'dsgfdsg',//bussinessId,
                    "param2": "valdfgdfgdfue2",
                },
                // "to":"ebdbZ0Zgmkc:APA91bHbHeBbT__0Oor-nZunfGBWCUw23gkBLm1FvhQ7u30dfEdEzFxKDVe71SHkt9_Y68eueGCZ7yVuGdJN_SELrJgfeYf4nz9esINvts9My8-phyFqKuFXispIuCXQq1waroXvMNP7iJz6ORYCFTNlBdp28L55Qg",
                "to": token,
                //"registration_ids": idArr,
                "priority": "high",
                "restricted_package_name": ""
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAARpGrUOI:APA91bG8gyXxS6RpMzYKI_O_yCCZsuvy56AYTmzA4Hk1jVamkG_i43EkpH04Is2M9sIvP_rlMZ3i5WVb8xfBlzRQ-Fu-xphIZbey6znFDmLjQKw74P8bwXdpPppOUxe-maDVupUMSo1n"
            }
        };

        client.post("https://fcm.googleapis.com/fcm/send", args, function (data, response) {
            // parsed response body as js object
            console.log("in post===>", JSON.stringify(data))
            if (data) {
                console.log(`Object of noti ${JSON.stringify(data)}`);
                let obj = {
                    customerId: { cid: customerId, image: image, name: name },
                      //bussinessId:{bid:bussinessId},
                    noti_type: 'BUSSINESS',
                    content: msg
                };
                let noti = new Noti(obj);
                noti.save((er1, ress) => {
                    console.log("noti api hit")
                    console.log(`Error is ${JSON.stringify(er1)}   result is ${JSON.stringify(ress)}`)
                    //response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, 'Order has been placed successfully and confirmation code send to your mobile number.',result)
                })
            } else {
                console.log(`Object of noti ${JSON.stringify(data)}`);
            }
            // raw response
            //console.log(response);
        });
    },

    //============================================ Notification for web push ====================================================================
    'sendNotification': (deviceToken, title, message, data,notiObj) => {
        console.log(`Device token is ${deviceToken}`)
        var serverKey = 'AAAAdtyNEC0:APA91bFeZPCM-fslejcqzZHNrXE_fExyhkjqn5FzuXj4mJ3X9pkClFG9Hs0I76-pnIRmw512uEVBkhrMBzYF7FbqEirrVS6anw0uEuu8o3gzZG48hhCKlQrIEIZs36os5qTZiRU9b02r';
        var fcm = new FCM(serverKey);

        var payload = {

            to: deviceToken, // required fill with device token or topics
            //registration_ids: tokenArray,
            collapse_key: 'your_collapse_key',
            notification: {
                title: title,
                body: message
            }
        };
        if(data != '')
            payload.data = data;

        //callback style
        fcm.send(payload, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!",err);
            } else {
                console.log("Successfully sent with response: ", response);
                let obj = {
                    customerId: { cid: notiObj.userId, image: notiObj.image, name: notiObj.name },
                    bussinessId: { bid: notiObj.businessManId },
                    noti_type: 'CUSTOMER',
                    content: message
                };
                let noti = new Noti(obj);
                console.log("******", noti)
                noti.save((er1, ress) => {
                    console.log(`Error is ${JSON.stringify(er1)}   result is ${JSON.stringify(ress)}`)
                    //response.sendResponseWithData(res, responseCode.EVERYTHING_IS_OK, 'Order has been placed successfully and confirmation code send to your mobile number.',result)
                })

            }
        });

    },

    'notificationForWeb': (pushSubscription, title, msg, bussinessId) => {
        console.log(`web noti api hit`)
        console.log("request for push-------->", JSON.stringify(req.body))
        console.log("inside push")
        const message = 'Notificartion for bussiness';//req.body.message;
        //  var subscription;
        var options = {
            gcmAPIKey: 'AIzaSyBhBx_hxg8QUCbjo_D3gb-dHFY_APurdl8',
            TTL: 24 * 60 * 60,
            vapidDetails: {
                subject: req.body.email,//'mailto:sender@example.com',
                publicKey: 'BDqxMfc7QPfi5AFUMvO8ciGMsTSWIVzcPvPUZvEhH33Z8iS2br8lLBIHkQfhcqElyy2GAk11UxIFlVQhJzzK34U',//vapidKeys.publicKey,
                privateKey: 'yS4QUTovZQASwXRx9IiVBXLnIkFl9-Q70AO3lMgDrs0'//vapidKeys.privateKey
            },
        }

    },

    testing:()=>{
        var serverKey = 'AAAAdtyNEC0:APA91bFeZPCM-fslejcqzZHNrXE_fExyhkjqn5FzuXj4mJ3X9pkClFG9Hs0I76-pnIRmw512uEVBkhrMBzYF7FbqEirrVS6anw0uEuu8o3gzZG48hhCKlQrIEIZs36os5qTZiRU9b02r';
        var fcm = new FCM(serverKey);
        var deviceToken = "eYATUn5umo8:APA91bHDBFkqQcjaJ1CRxffFjo81BDKBGOj8u5Dbx6mWB6E2Iw8bxJ_aMGX2PF9oO1EwI3EWPSvETWXyebOQT6Q5CGF76-AZa_jp_ylCd1CGO8r1FG_mSVK-EHFgtexG3mYy8lyx3utN";
        var payload = {
            to: deviceToken, // required fill with device token or topics
            //registration_ids: tokenArray,
            collapse_key: 'your_collapse_key',
            notification: {
                title: 'title',
                body: 'message'
            }
        };
            payload.data = {
                hf:'gfghfghj',
                fghf:'hfghfghfgh'
            };

        //callback style
        fcm.send(payload, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!",err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }

}

module.exports = notifications;