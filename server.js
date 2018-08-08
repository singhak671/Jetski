const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var userSchema =require("./models/userModel");
const environment = require('./config/config')();
const dbconnection = require('./db_handler/mongodb');
const mongoose = require('mongoose');
const common = require('./common_functions/message');
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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
res.sendFile(__dirname + '/dist/index.html')
});

app.listen(environment.port,()=>{
    console.log(`Server is running on ${environment.port}`)
})