const mongoose = require("mongoose");

const requestRegistrationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    country:{
        type: String,
        requied: true
    },
    city:{
        type:String,
        required:true  
    },
    zip:{
        type: String,
        required: true
    },

    neighborhood:{
        type:String,
        required:true 
    },
    street:{
        type:String,
        required:true 
    },
    licence: {
        type: String,
        required: true
    },
    availPharmacists: {
        type: Number,
    },
    createPassword: {
        type: String,

        required: true
    },
    pharmaApprove:{
        type: String,
        default: ""
    }

})
requestRegistrationSchema.virtual("id").get(function(){
    return this._id.toHexString();

})
requestRegistrationSchema.set('toJSON',{
    virtuals:true
})

exports.RequestRegistration = mongoose.model('requestRegistration', requestRegistrationSchema);