const mongoose = require("mongoose");

const licenceInfoSchema = mongoose.Schema({
    pharmaName: {
        type: String,
        required: true
    },
    zip:{
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
    
    neighborhood:{
        type:String,
        required:true 
    },
    street:{
        type:String,
        required:true 
    },
    LICNO: {
        type: String,
        required: true
    }
})
licenceInfoSchema.virtual("id").get(function(){
    return this._id.toHexString();
})
licenceInfoSchema.set('toJSON',{
    virtuals:true
})

exports.LicenceInfo = mongoose.model('licenceInfo', licenceInfoSchema);