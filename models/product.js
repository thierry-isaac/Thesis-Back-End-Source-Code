const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type:String,
        required:true    
    },
    image: {
        type: String,
        default: ''
    },
   
    description: {
        type: String,
        required: true
    },
    detailedDescription:{
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,

    },
    countInStock: {
        type:Number,
        require: true,
        min: 0,
        max: 255,
    },
    datCreated: {
        type: Date,
        default: Date.now
    },
    userLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },
    images:[{
        type: String,
    }],
})
productSchema.virtual("id").get(function(){
    return this._id.toHexString();
})
productSchema.set('toJSON',{
    virtuals:true
})

// productSchema.method('toJSON', function(){
//     const { __v, ...object } = this.toObject();
//     const { _id:id, ...result } = object;
//     return { ...result, id };
// });

exports.Product = mongoose.model('Product', productSchema);