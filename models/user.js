const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    onlyAdmin:{
        type: Boolean,
    default: false

    },

    name:{
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    passwordHash:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default:false
    },
    isPharmacy:{
        type: Boolean,
        default: false
    },
    country:{
        type: String,
        default: ""
    },
    city:{
        type: String,
        default:""
    },
    neghborhood:{
        type: String,
       default: ""
    },
    street:{
        type: String,
        default: ""
    },
    zip:{
        type: String,
        default: ""
    },

    
})

userSchema.virtual("id").get(function(){
    return this._id.toHexString();
})
userSchema.set('toJSON',{
    virtuals:true
})

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;