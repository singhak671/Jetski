const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema=mongoose.Schema;
const User=require("./userModel");
const business = mongoose.Schema({
   businessName: {
        type: String
    },
    businessId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
   
   businessDescription: {
        type: String
    },
   businessImage: [
         String
    ],
   businessPrice: {
        type: Number
    },
    businessAddress: {
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