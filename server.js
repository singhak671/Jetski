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
const keyPublishable = 'pk_test_NkhYVArGE07qHgai7PuO6Bbm';
const keySecret = 'sk_test_4Sht4ZSKz8eUDCaiXP5pGfs6';
const stripe = require("stripe")(keySecret);

const cors = require('cors');
const path = require('path');
app.use(cors());  
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json({
    limit: '50mb'
}));

// var job =new CronJob('* * * * *', function(req,res) {
//     // for 1 min 
// var job =new CronJob('0 * * * *', function(req,res) {
//     // for 1 hrs
//     console.log("Testing is going ON per 1 hrs*************")

//  }, function () {
//         console.log(" Payment refund successfully")
//    },
//  true
// );

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
                if (item.bookingStatus == 'CONFIRMED') {
                    booking.update({ _id: item._id }, { $set: { 'bookingStatus': 'COMPLETED' } }, { multi: true }).exec((err1, succ1) => {
                        console.log('error ,succes==========>>>>>>', err1, succ1);
                        if (err1)
                            console.log('Error is====>>>>>', err1);
                        else if (succ1) {
                            console.log('Status updated successfully====>>>>', succ1);
                            next();
                        }
                    })
                }
                else if (item.bookingStatus == 'PENDING') {
                    booking.findByIdAndUpdate({ _id: item._id }, { $set: { 'bookingStatus': 'CANCELLED' } }, { multi: true }).exec((err1, succ1) => {
                        console.log('error ,succes==========>>>>>>', err1, succ1);
                        if (err1)
                            console.log('Error is====>>>>>', err1);
                        else  {
                            console.log("succ1------>",succ1)
                            return stripe.refunds.create({
                                charge: succ1.chargeId,
                                amount: (succ1.eventPrice),
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
//   source_transaction: "{CHARGE_ID}",
//   destination: "{CONNECTED_STRIPE_ACCOUNT_ID}",
// }).then(function(transfer) {
//   // asynchronously called
// });
