const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var eventSchema = require('../models/eventManagementModel');
const messageSchema = mongoose.Schema({
    businessManId:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    message:[
        {
            senderId:{
                type:Schema.Types.ObjectId,
                ref: 'User'
            },
            message:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now()
            }
            
        }
    ],
    eventId:{
        type:Schema.Types.ObjectId,
        ref: 'businesses'
    },
    noti_type:{
        type:String,
        enum:['BUSSINESS','CUSTOMER']
    },
    status:{
        type:String,
        default:"ACTIVE",
        enum:['ACTIVE','INACTIVE']
    }
},
{

});
messageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('message', messageSchema);