const express = require("express");
const { Aggregate } = require("mongoose");
const {Order} = require("../models/order");
const { OrderedItem } = require("../models/orderedItem");

const router = express.Router();

router.get(`/`, async (req, res)=>{
    // const product = {
    //     id: 1,
    //     name: "para",
    //     image: "some_url"
    // }

    const order = await Order.find().populate("user", "name").sort({"dateOrdered": -1});
    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order)
})

router.get("/:id", async(req, res)=>{
    
    const order = await Order.findById(req.params.id).populate("user","name").populate({path: "orderedItems", populate: "product"})
    if(!order)
    return res.status(500).send("Order could not be found")
    res.status(200).send(order)
})
router.post(`/`, async (req, res)=>{
    
  const orderedItemId =  Promise.all(req.body.orderedItems.map(async orderedItem =>{
      let newOrderedItem = new OrderedItem({
          quantity: orderedItem.quantity,
          product:  orderedItem.product
      })
      newOrderedItem = await newOrderedItem.save()
      return newOrderedItem._id
  }) )

  const orderedItemsIds = await orderedItemId;


  const calPrices = await Promise.all(orderedItemsIds.map(async orderedItemId =>{
    const orderedItem = await OrderedItem.findById(orderedItemId).populate("product", "price");
    const calPrice = orderedItem.product.price * orderedItem.quantity;
    return calPrice;
  }))

  const calPrice = calPrices.reduce((a,b)=> a+b,0)

let order = new Order({
    orderedItems: orderedItemsIds,
    shippingAddress: req.body.shippingAddress,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    user: req.body.user, 
    price: calPrice
})

order = await order.save();
if(!order){
    return res.status(500).send("Order could not be made");
}
return res.send(order);
})


router.put("/:id", async(req, res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
           status: req.body.status
        },
        {
            new: true
        }
    )
    if(!order){
        res.status(500).json({message: "the order cound not be updated"})
    }
    res.status(200).send(order)
})

router.delete("/:id",(req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order){
            await order.orderedItems.map(async orderedItem =>{
                await OrderedItem.findByIdAndRemove(orderedItem)
            })
        return res.status(200).json({success: true, message: "Order deleted successfuly"})
        } else {
        return res.status(404).json({success:false, message: "Order Not deleted"})
        }
        
    }).catch(err=>{
        return res.status(400).json({success:false, error: err})
    })
})

router.get("/get/totalSales", async (req, res)=>{
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales: {$sum: '$price'}}}
    ])
    if(!totalSales){
      return  res.status(400).send("the sales could not be generated")
    }
 res.send({totalsales: totalSales})
})

router.get(`/get/count`, async (req, res)=>{

    const orderCount = await Order.countDocuments((count)=>count);
    if(!orderCount){
        res.status(500).json({success:false})
    }
    res.send({
        orderCount: orderCount
    })
})
module.exports = router;