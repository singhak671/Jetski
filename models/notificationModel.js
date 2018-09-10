const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const notificationSchema = new Schema({
    customerId: {
        cid:{type:Schema.Types.ObjectId,ref:'Users'},
        image:{type:String},
        name:{type:String},
        isRead:{type:Boolean, default:false}
    },
    bussinessId:{
        bid:{type:Schema.Types.ObjectId,ref:'Users'},
        isRead:{type:Boolean, default:false}
    },
    
    noti_type:{
        type:String,
        enum:['BUSINESS','CUSTOMER']
    },
    content:{
        type: String
    },
    title:{
        type:String
    },
    type:{
        type:String,
        enum:['chat', 'event', 'feedback']
    },
    eventId:{type:Schema.Types.ObjectId,ref:'Businesses'},
    eventStatus:{
        type:String,
        enum:['PENDING', 'CANCELLED', 'CONFIRMED', 'COMPLETED']
    },
    status:{
        type:String,
        default:"ACTIVE",
        enum:['ACTIVE','INACTIVE']
    }
},{
    timestamps:true
});

notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Notification",notificationSchema);