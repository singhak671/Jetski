const mongoose =  require('mongoose');
global.Promise = mongoose.Promise;
const config = require('../config/config')();

const DB_URL = `mongodb://localhost/JET_SKI`;

var againConnect = ()=>{
    setInterval(()=>{
        db_connect();
    },1000)
}

function db_connect(){
    mongoose.connection.openUri(DB_URL);
};
db_connect();

mongoose.connection.on('connected', () =>{ 
    clearInterval(againConnect);
});

mongoose.connection.on('error', (error) => {
});

mongoose.connection.on('disconnected', () => {
    againConnect();
})