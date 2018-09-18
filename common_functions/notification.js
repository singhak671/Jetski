var apn = require("apn");
var FCM = require('fcm-push');
var options = {
    "cert": "MobiloitteEnterpriseDistribution.pem",
    "key": "MobiloitteEnterpriseDistribution.pem",
    "passphrase": "Mobiloitte1",
    "gateway": "gateway.sandbox.push.apple.com",
    "port": 2195,
    "enhanced": true,
    "cacheLength": 5,
    production: true
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


    'iosPush': (deviceToken, title, message, data) => {
        var apnConnection = new apn.Connection(options);
        var myDevice = new apn.Device(deviceToken);
        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; 
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = title + ' ' + message;
        note.payload = data
        try {
            apnConnection.pushNotification(note, myDevice); 
            apnConnection.on('transmitted', function (note, deviceToken) {
            });
        } catch (ex) {
         
        }
    },
    //====================================Notification for app====================================================================
    'single_notification': (title, msg, bussinessId, customerId, image, name, type, eventStatus,eventId )=>{
        let obj = {
            customerId: { cid: customerId, image: image, name: name },
            bussinessId: { bid: bussinessId },
            noti_type: 'BUSINESS',
            title:title,
            content: msg,
            type:type,
            eventStatus:eventStatus,
            eventId:eventId 
        };
        let noti = new Noti(obj);
        noti.save((er1, ress) => {
        })
    }, 

//=======================================================Notification by fcm================================================================
'sendNotification': (deviceToken, title, message, data, notiObj) => {
        var serverKey = 'AAAAdtyNEC0:APA91bFeZPCM-fslejcqzZHNrXE_fExyhkjqn5FzuXj4mJ3X9pkClFG9Hs0I76-pnIRmw512uEVBkhrMBzYF7FbqEirrVS6anw0uEuu8o3gzZG48hhCKlQrIEIZs36os5qTZiRU9b02r';
        var fcm = new FCM(serverKey);
        data["title"] = title;
        data["body"] = message;
        var payload = {

            to: deviceToken, 
            "content_available": true,
            collapse_key: 'your_collapse_key',
          
            notification: {
                title: title,
                body: message,
                click_action: "fcm.ACTION.NOTIF"
            },
            data : data
        };
        

        fcm.send(payload, function (err, response) {
            if (err) {
            } else {             
                let obj = {
                    customerId: { cid: notiObj.userId, image: notiObj.image, name:notiObj.name },
                    bussinessId: { bid: notiObj.businessManId },
                    noti_type: 'CUSTOMER',
                    eventId:notiObj.eventId,
                    content: message,
                    type:notiObj.type,
                    
                };
                if(notiObj.eventStatus)
                    obj.eventStatus = notiObj.eventStatus;

                let noti = new Noti(obj);
                noti.save((er1, ress) => {
                })

            }
        });

    },

        'notificationForWeb': (pushSubscription, title, msg, bussinessId) => {
            const message = 'Notificartion for bussiness';
            var options = {
                gcmAPIKey: 'AIzaSyBhBx_hxg8QUCbjo_D3gb-dHFY_APurdl8',
                TTL: 24 * 60 * 60,
                vapidDetails: {
                    subject: req.body.email,
                    publicKey: 'BDqxMfc7QPfi5AFUMvO8ciGMsTSWIVzcPvPUZvEhH33Z8iS2br8lLBIHkQfhcqElyy2GAk11UxIFlVQhJzzK34U',//vapidKeys.publicKey,
                    privateKey: 'yS4QUTovZQASwXRx9IiVBXLnIkFl9-Q70AO3lMgDrs0'
                },
            }

        },
}

module.exports = notifications;