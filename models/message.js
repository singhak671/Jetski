const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var eventSchema = require('../models/eventManagementModel');
const messageSchema = mongoose.Schema({
    businesssManId:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    message:[
        {
            senderId:{
                type:Schema.Types.ObjectId,
                ref: 'user'
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
    }
},
{

});
messageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('message', messageSchema);