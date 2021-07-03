const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    orderedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderedItem",
        required: true,

    }],
    
   shippingAddress: {
    type: String,
    required:true,
   },
   city: {
       type: String,
       required: true,
   },
   zip:{
       type: String,
       required: true
   },
   country: {
       type: String,
       required: true
   },
   phone:{
       type: String,
       required: true
   },
   status:{
       type: String,
    //    required: true,
       default: "Pending",
   },
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
   },
   prescription:{
    type: String,
    required: true

   },
   price: {
    type:Number,
    required: true
},
   dateOrdered: {
       type: Date,
       default: Date.now
   },
   
})

orderSchema.virtual("id").get(function(){
    return this._id.toHexString();
})
orderSchema.set('toJSON',{
    virtuals:true
})


exports.Order = mongoose.model("Order", orderSchema);