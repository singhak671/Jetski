const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema=mongoose.Schema;
const User=require("./userModel");
const business = mongoose.Schema({
   eventName: {
        type: String
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
   
   eventDescription: {
        type: String
    },
   eventImage: [
         String
    ],
   eventPrice: {
        type: Number
    },
    eventAddress: {
        type: String
    },
    
    mostViewed: {
        type: Number,
        default:0
    },
    mostSearched:{
        type:Number,
        default:0
    },

    pushNotification: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        default: "ACTIVE"
    },

    // created_At:{
    //     type:Date,
    //     default:Date.now()
    // },
},
 {
    timestamps: true
 });

business.plugin(mongoosePaginate);
module.exports = mongoose.model('Businesses',business);