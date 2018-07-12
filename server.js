const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var userSchema =require("./models/userModel");
var businessSchema= require('./models/businessModel')
const environment = require('./config/config')();
const dbconnection = require('./db_handler/mongodb');
const mongoose = require('mongoose');
const common = require('./common_functions/message');
const cors = require('cors');
const CronJob = require('cron').CronJob;
// mongoose.connect('mongodb://localhost/JET_SKI');

const PORT = 8000;
app.use(cors());  
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use('/api/v1/user', require('./routes/userRoute'));
//app.use('/api/v1/webBusiness', require('./routes/businessRoute'));
app.use('/api/v1/static', require('./routes/termsAndPrivacyRoutes'));
//app.use('/api/v1/business',require('./routes/userRoute'));
//app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//     res.sendFile(__dirname + '/dist/index.html')
//     });
    



app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})