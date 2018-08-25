const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var userSchema =require("./models/userModel");
const environment = require('./config/config')();
const dbconnection = require('./db_handler/mongodb');
const mongoose = require('mongoose');
const common = require('./common_functions/message');
const CronJob = require('cron').CronJob;

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
var job =new CronJob('0 * * * *', function(req,res) {
    // for 1 hrs
    console.log("Testing is going ON per 1 hrs*************")

 }, function () {
        console.log(" Payment refund successfully")
   },
 true
);

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
