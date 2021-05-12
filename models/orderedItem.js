const mongoose = require("mongoose");

const orderedItemSchema = mongoose.Schema({
    quantity:{
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }
})

orderedItemSchema.virtual("id").get(function(){
    return this._id.toHexString();
})
orderedItemSchema.set('toJSON',{
    virtuals:true
})
exports.OrderedItem = mongoose.model("OrderedItem", orderedItemSchema);