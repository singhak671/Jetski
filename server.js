const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = require('./config/config')();
const dbconnection = require('./db_handler/mongodb');
const mongoose = require('mongoose');
const cron = require('node-cron');
const asyncLoop = require('node-async-loop');
var booking = require("./models/bookingModel.js")
const keySecret = 'sk_test_7OyC78h4UYqhcEiH2N2vcX9O';//client
const stripe = require("stripe")(keySecret);
var notification = require('./common_functions/notification');

const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/admin', require('./routes/userRoute'));
app.use('/api/v1/static', require('./routes/termsAndPrivacyRoutes'));
app.use('/api/v1/event', require('./routes/eventRoute'));
app.use('/api/v1/chat', require('./routes/chatRoute'));
app.use('/api/v1/notification', require('./routes/notificationRoute'));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
});

//---------------------------------------------------cron started -------------------------------------//

cron.schedule('* */24 * * *', () => {
    booking.find({}).exec((err, succ) => {
        asyncLoop(succ, (item, next) => {
            var result = item.duration[0].date.formatted + "T" + item.duration[0].endTime + ":00.000Z"
            var temp = new Date(result).getTime()
            var today_date = Date.now()
            var today_temp_date = today_date + 19800000;
            var today_new_date = new Date(today_temp_date).toISOString();
            var ss = today_new_date.split(/:/g)
            var text = '';
            text += ss[0] + ':' + ss[1] + ":00.000Z"
            var current_time_stamp = new Date(text).getTime();
            if (temp <= current_time_stamp) {
                if (item.bookingStatus == 'CONFIRMED') {
                    booking.findById({ _id: item._id }).populate({ path: "businessManId", select: "stripeAccountId" }).exec((err1, succ1) => {
                        if (succ1) {
                            var amount = ((80 * succ1.eventPrice) / 100) * 100
                            stripe.transfers.create({
                                amount: Math.round(amount),
                                currency: "usd",
                                destination: succ1.businessManId.stripeAccountId,
                            }).then(function (transfer) {
                                booking.findByIdAndUpdate({ _id: item._id }, { $set: { 'bookingStatus': 'COMPLETED' } }, { multi: true }).exec((err11, succ11) => {
                                })
                            });
                            next();
                        }
                    })
                }
                else if (item.bookingStatus == 'PENDING') {
                    booking.findById({ _id: item._id }).exec((err1, succ1) => {
                        if (err1){
                            console.log("err in refunds", err1)
                        }
                        else {
                            return stripe.refunds.create({
                                charge: succ1.chargeId,
                                amount: succ1.eventPrice,
                            }, function (err, refund) {
                                if (err) {
                                }
                                else {
                                    booking.findByIdAndUpdate({ _id: item._id }, { $set: { 'bookingStatus': 'CANCELLED' } }, { multi: true }).populate({ path: 'userId', select: 'deviceToken deviceType name profilePic' }).exec((err1_, succ1_) => {
                                        var notiObj = {
                                            businessManId: result.businessManId,
                                            userId: succ1_.userId._id,
                                            profilePic: succ1_.userId.profilePic,
                                            name: succ1_.userId.name,
                                            type: 'event' 
                                        }
                                        if (succ1.userId.deviceType == 'IOS')
                                            return notification.sendNotification(succ1.userId.deviceToken, 'booking cancelled !', `Your booking is cancelled for ${succ1.eventName}`, notiObj, notiObj)

                                        if (succ1.userId.deviceType == 'ANDROID') {
                                            notification.sendNotification(succ1.userId.deviceToken, 'booking cancelled !', `Your booking is cancelled for ${succ1.eventName}`, notiObj, notiObj)
                                        }

                                        if (succ1.deviceType == 'WEBSITE') {
                                            notification.single_notification('booking cancelled !', `Booking is cancelled requested for the event ${succ1.eventName}`, succ1.businessManId, succ1.userId, succ1.userId.profilePic, succ1.userId.name)
                                        }

                                        next();
                                    })
                                }

                            })

                        }
                    })
                }
            }
            next();
        })
    })
})
//------------------------------------------------------- cron ended ------------------------------------------//
app.listen(environment.port, () => {
console.log(`Server is running on ${environment.port}`)
})



















