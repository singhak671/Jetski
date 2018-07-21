const mongoose =  require('mongoose');
const log = console.log;
global.Promise = mongoose.Promise;
const config = require('../config/config')();



// const config = require('../config/env/development').db.name;
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
    log(`DB connected`);
});

mongoose.connection.on('error', (error) => {
    log(`Error in DB connetcion is ${error}`);
});

mongoose.connection.on('disconnected', () => {
    againConnect();
})