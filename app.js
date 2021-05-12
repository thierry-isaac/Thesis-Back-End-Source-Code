const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Product = require('./models/product')
const cors = require("cors")
const authJwt = require("./helpers/jwt")
const errorHandler = require("./helpers/error-handler")


// const productSchema = mongoose.Schema({
//     name: String,
//     image: String,
//     countInStock: {
//         type:Number,
//         require: true,
//     },
// })

// const Product = mongoose.model('Product', productSchema);


require("dotenv/config")
const api = process.env.API_URL

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.options("*", cors());
app.use(authJwt());
app.use(errorHandler);
app.use("/public/productsImages/", express.static(__dirname+"/public/productsImages/"))


const userRouter = require('./routers/users')
const orderRouter = require('./routers/orders')
const productRouter = require('./routers/products')
const categoryRouter = require('./routers/categories')

app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);

// app.get(`${api}/products`, async (req, res)=>{
//     // const product = {
//     //     id: 1,
//     //     name: "para",
//     //     image: "some_url"
//     // }

//     const product = await Product.find();
//     if(!product){
//         res.status(500).json({success:false})
//     }
//     res.send(product)
// })

// app.post(`${api}/products`, (req, res)=>{
    
// const product = new Product({
//     name: req.body.name,
//     image: req.body.image,
//     countInStock: req.body.countInStock
// })
// product.save().then((createdProduct=>{
//     res.status(201).json(createdProduct)
// })).catch((err)=>{
//     res.status(500).json({error: err,
//         success:false})
// })})

    // res.send(newProduct);


mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName:"pharmaPlus"
})
.then(()=>{
    console.log("Database connected successfully ...")
})
.catch((error)=>{
    console.log(error)
})
//Development
// app.listen(3000, ()=>{
//     console.log(api)
//     console.log("Here is the server running")
// })

 
//Production
var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("Express is working on port +"+port)
})