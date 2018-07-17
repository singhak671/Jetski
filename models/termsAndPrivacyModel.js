const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const termsPrivacySchema = new Schema({
    termsAndConditions: {
        type: String
    },

    privacyPolicy: {
        type: String
    },

    aboutUs:{
        type: String
    },

},{
    timestamps: true
});

module.exports = mongoose.model("Static",termsPrivacySchema);

mongoose.model('Static',termsPrivacySchema).find((error,result)=>{
    if(result.length==0)
    {
        let obj = {
            termsAndConditions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            privacyPolicy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            aboutUs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        };
        mongoose.model('Static',termsPrivacySchema).create(obj,(error,success)=>{
            if(error)
                console.log("Error is"+ error)
            else

                console.log("Static content saved succesfully.",success);
        })
    }
})