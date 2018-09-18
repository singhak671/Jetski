const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const userFeedbackSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Businesses'
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    businessName:{
        type: String
    },

    feedback: [
        {
            feedbackDescription: {
                type: String
            },

            starsCount: {
                type: Number,
                default:0
            },
           
            feedbackTime: {
                type: Date,
                default: Date.now()
            }

        }
    ],
  
    businessManId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},

    {
        timestamps: true
    });

userFeedbackSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('UserFeedback', userFeedbackSchema, "UserFeedback");