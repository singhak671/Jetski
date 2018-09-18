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

    eventImage:{
        type:String
    },
   eventPrice: {
        type: String
    },
    eventAddress: {
        type: String
    },
    
    status: {
        type: String,
        enum: ["ACTIVE","INACTIVE","BLOCK"],
        default: "ACTIVE"
    },

   

    period:{
        type:String,
        enum:["DAILY","MONTHLY","WEEKLY"]
    },

    duration: {type:Array},
            

    
    eventCreated_At:{
        type:Date,
        default:Date.now()
    },

    jwtToken:{
        type:String
    },

    deviceToken:{
        type:String
    },

    offset:{
     type:Number
    },
    
    bookingId:{
        type: Schema.Types.ObjectId
    },
    businessName:{
        type:String
    },


},
    {
        timestamps: true
    });

business.plugin(mongoosePaginate);
module.exports = mongoose.model('Businesses',business);