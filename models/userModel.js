const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');
var eventSchema = require('../models/eventManagementModel');
const user = mongoose.Schema({

    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        //

    },
    name: {
        type: String
    },
    mobile_no: {
        type: String
    },
    address: {
        type: String
    },

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "BLOCK"],
        default: "ACTIVE"
    },
    userType: {
        type: String,
        default: "CUSTOMER",
        enum: ['CUSTOMER', 'SUPERADMIN', 'BUSINESS']
    },

    socialId: {
        type: String
    },


    country: {
        type: String
    },

    businessName: {
        type: String
    },

    accountInfo: {
        type: String
    },
    services: [{
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Businesses',


        },
        eventIdPeriod: {
            type: String
        },
        _id: false

    }],

    deviceToken: {
        type: String
    },
    deviceType: {
        type: String,

        enum: ["IOS", "WEBSITE", "ANDROID"]
    },
    reviews: {
        type: String
    },
    stripeAccountId: {
        type: String
    },
    pushSubscription: {
        endpoint: { type: String },
        keys: {
            p256dh: { type: String },
            auth: { type: String }
        }
    },

    addAccountInfo: {
        cardName: { type: String },
        cvv: { type: String },
        expiryDate: { Date },
        stripeToken: { type: String }
    },

    profilePic: {
        type: String,
        default: "http://res.cloudinary.com/dhp4gnyyd/image/upload/v1516084496/ptxhxz72rldohuap7k3g.png"
    },

    dateOfBirth:
        { type: Object },

    gender: {
        type: String,
        enum: ['Male', 'Female']
    }


},
    {
        timestamps: true
    });
user.plugin(mongoosePaginate);
module.exports = mongoose.model('User', user);

//........................................SUPERADMIN Created...............................................//

(function init() {

    let obj = {
        
        adminName: "JET SKI",
        password: "Aqualudus91",
        userType: "SUPERADMIN",
        email: "aqualudusllc@gmail.com"
      

    };
    let salt = bcrypt.genSaltSync(10);
    obj.password = bcrypt.hashSync(obj.password, salt)
    mongoose.model('Users', user).findOne({ userType: "SUPERADMIN" }, (err, result) => {
        if (err) console.log("Super Admin creation at findOne error--> ", err);
        else if (!result) {
            mongoose.model('Users', user).create(obj, (err, success) => {
                if (err) console.log("Super Admin creation at create method error--> ", err);
                else
                    console.log("Super Admin creation at create method success--> ", success);
            })
        } else {
            console.log("Super Admin.");
        }

    })
})

    ();
