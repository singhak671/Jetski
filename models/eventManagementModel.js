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

    eventStatus:{
        type:String,
        enum:["PENDING","CONFIRMED","REJECTED"],
      //  default:"PENDING"
        },

    period:{
        type:String,
        enum:["DAILY","MONTHLY","WEEKLY"]
    },

    duration: {type:Array},
            
    // businessImage: {type:String},

    
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

    bookingId:{
        type: Schema.Types.ObjectId
    }

},
    {
        timestamps: true
    });

business.plugin(mongoosePaginate);
module.exports = mongoose.model('Businesses',business);