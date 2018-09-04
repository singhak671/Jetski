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
        enum:['BUSSINESS','CUSTOMER',]
    },
    content:{
        type: String
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