const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');
const user = mongoose.Schema({
    

   email: {
       type: String, 
    },
   password: {
       type: String,
       //
       
    },
    name:{
     type:String
    },
   mobile_no:{
       type: String
    },  
    address: {
        type:String
    },
    compCount:{
        type:Number
    },
    status:{
        type:String,
        default:"ACTIVE"
    },
    userType:{
        type:String,
        default:"CUSTOMER",
        enum:['CUSTOMER', 'SUPERADMIN', 'BUSINESS']
    },
    created_At:{
        type:Date,
        default:Date.now()
    },

    // jwtToken:
    // {
    //     type:String
    // },

    
socialId:{type: String},
   

    country:{
        type:String
    },

    businessName:{
        type:String
    },

    deviceToken:{
        type:String
    },

    addAccountInfo:{
        cardName:{ type:String},
        cvv:{type:String},
        expiryDate:{Date}
    },

    profilePic:String,

    dateOfBirth:{
        type:Date
    },

    gender:{
        type:String,
        enum:['MALE', 'FEMALE']
    }

    // isApproved: {
    //     type: Boolean,
    //     default: true
    // },
  
},
{
    timestamps: true
});
user.plugin(mongoosePaginate);
module.exports = mongoose.model('User', user);

//....SUPERADMIN Created.....//

(function init() {

    let obj = {
        adminName: "Pramod Giri",
        password: "admin1234",
        userType: "SUPERADMIN",
        email: "pramod.giri@mobiloitte.in",
        mobile_no: "+918299547036",
        address: "Okhla Phase-1, Delhi"
        };
    let salt = bcrypt.genSaltSync(10); 
    obj.password = bcrypt.hashSync(obj.password, salt)
    mongoose.model('Users',user).findOne({userType:"SUPERADMIN"}, (err, result) => {
        if (err) console.log("Super Admin creation at findOne error--> ", err);
        else if (!result) {
            mongoose.model('Users',user).create(obj, (err, success) => {
                if (err) console.log("Super Admin creation at create method error--> ", err);
               
                else 
                  //  var token =  jwt.sign({_id:result._id,email:result.email,password:result.password},config.secret_key);
                    console.log("Super Admin creation at create method success--> ",success);
                
                    
            })
        } else {
            console.log("Super Admin.");
        }

    })
})();
