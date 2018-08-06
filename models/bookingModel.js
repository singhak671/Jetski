
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

    duration: {
        type: Array,
        ref: 'Businesses'
    },
    bookingStatus: {
        type: String,
        default: "PENDING"
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Booking', booking);
