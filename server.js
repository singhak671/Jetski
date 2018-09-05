const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var userSchema =require("./models/userModel");
const environment = require('./config/config')();
const dbconnection = require('./db_handler/mongodb');
const mongoose = require('mongoose');
const common = require('./common_functions/message');
const CronJob = require('cron').CronJob;
const cron = require('node-cron');
const asyncLoop = require('node-async-loop');
var booking = require("./models/bookingModel.js")
const keySecret = 'sk_test_c1fuFQmWKd4OZeCThFOtLFuY';
const stripe = require("stripe")(keySecret);
const keyPublishable = 'pk_test_NS4RiEEZeWMhQEcxYsEfRH5J';

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
app.use('/api/v1/event',require('./routes/eventRoute'));
app.use('/api/v1/chat',require('./routes/chatRoute'));
app.use('/api/v1/notification',require('./routes/notificationRoute'));


app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
res.sendFile(__dirname + '/dist/index.html')
});

//-------------------------------cron started -------------------------------------

cron.schedule('0 * * * *', () => {
console.log(" inside crone)))))))))")
    booking.find({}).exec((err, succ) => {
        asyncLoop(succ, (item, next) => {
            var result = item.duration[0].date.formatted + "T" + item.duration[0].times[0].time + ":00.000Z"
            // "2018-08-30T15:23:00.000Z"
             console.log("i am here ....>>>>", result)
            var newTime = new Date(result)
            var temp = new Date(result).getTime()
            // var c=temp+19800000
            // console.log('temp value =>>>', temp);
            var today_date = Date.now()
            var today_temp_date = today_date + 19800000;
            var today_new_date = new Date(today_temp_date).toISOString();
            var ss = today_new_date.split(/:/g)
            var text = '';
            text += ss[0] + ':' + ss[1] + ":00.000Z"
            var current_time_stamp = new Date(text).getTime();
            // console.log("current timeStamp", current_time_stamp)
            // console.log("@@@@@@@@@@@@@@@@", temp <= current_time_stamp);
            if (temp <= current_time_stamp) {
                // console.log(" inside time stamp)))))))))")
                // console.log("checking of booking status",item.bookingStatus)
                if (item.bookingStatus == 'CONFIRMED') {
                    // console.log(" inside booking status)))))))))")
                    booking.findByIdAndUpdate({ _id: item._id }, { $set: { 'bookingStatus': 'COMPLETED' } }, { multi: true }).populate({ path: "businessManId", select: "stripeAccountId" }).exec((err1, succ1) => {
                         console.log('error ,succes==========>>>>>>', err1, succ1);
                        if (err1)
                            console.log('Error is====>>>>>', err1); 
                        else if (succ1) {
                             console.log('Status updated successfully====>>>>', succ1); 
                            stripe.transfers.create({
                                  amount: 100,
                                  currency: "usd",
                                 
                                  destination: succ1.businessManId.stripeAccountId,
                                //   description: "admin to business",
                                   source_transaction: "acct_1D6trWBo1Ono9k1p",
                                //   destination:'acct_1D6FRDB3m6P1mUHh',//succ1.businessStripeAccount//"acct_1D6FRDB3m6P1mUHh", 
                                }).then(function(transfer) {
                                 console.log("transfer------++++++++++->>>",transfer)
                                });
                            next();
                        }
                    })
                }
                else if (item.bookingStatus == 'PENDING') {
                    // console.log(" inside pending status)))))))))")
                    booking.findByIdAndUpdate({ _id: item._id }, { $set: { 'bookingStatus': 'CANCELLED' } }, { multi: true }).exec((err1, succ1) => {
                        console.log('error ,succes==========>>>>>>', err1, succ1);
                        if (err1)
                             console.log('Error is====>>>>>', err1);
                        else  {
                            // console.log("succ1------>",succ1)
                            return stripe.refunds.create({
                                charge: succ1.chargeId,
                                amount: (succ1.eventPrice)*100,
                            }, function (err, refund) {
                                if (err) {
                                    console.log("err in refunds", err)
                                }
                                else {
                                    console.log('success refund-->', refund)
                                    //callback('',refund)
                                    next();
                                }
                                   
                            })
                           
                        }
                    })//
                }
            }
            next();
        })
    })
})
//------------------------------- cron ended ------------------------------------




app.listen(environment.port,()=>{
    console.log(`Server is running on ${environment.port}`)
})

//************************For transfer the amount************************************************************************/
//https://stripe.com/docs/connect/charges-transfers
// var stripe = require("stripe")("sk_test_4Sht4ZSKz8eUDCaiXP5pGfs6");

// stripe.transfers.create({
//   amount: 1000,
//   currency: "usd",
//   source_transaction: "{acct_1D15riFvUkcGB9ta}",
//   destination: "{CONNECTED_STRIPE_ACCOUNT_ID}", 
// }).then(function(transfer) {
//   // asynchronously called
// });
