
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

const User = require("./userModel");
const Businesses = require("./eventManagementModel");
const booking = mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Businesses'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    period:{
        type:String,
        enum:["DAILY","MONTHLY","WEEKLY"]
    },
    duration: {
        type: Array,
        ref: 'Businesses'
    },
    bookingStatus: {
        type: String,
        default: "PENDING"
    },
    businessManId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    });
    booking.plugin(mongoosePaginate);

module.exports = mongoose.model('Booking', booking);
