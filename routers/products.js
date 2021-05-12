const express = require("express");
const {Product} = require("../models/product")
const {Category} = require("../models/category");
const { User } = require("../models/user");
const mongoose =  require("mongoose");
const multer = require("multer")
const router = express.Router();

const FILE_TYPE_MAP = {
    "image/png": "png",
    
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let wrongType = new Error('image type is invalid');
        if(isValid){
            wrongType = null
        }
      cb(wrongType, 'public/productsImages')
    },
   
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(" ", "-");
        const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
   
  const upload = multer({ storage: storage })



router.get(`/`, async (req, res)=>{
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }

    const product = await Product.find(filter).populate("category").populate("userLocation");
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product)
})

router.get("/:id", async(req, res)=>{
    
    const product = await Product.findById(req.params.id).select("name image -_id").populate("userLocation")
    if(!product)
    return res.status(500).send("Product could not be found")
    res.status(200).send(product)
})

router.post(`/`, upload.single('image'), async (req, res)=>{

const category = await Category.findById(req.body.category);
const user = await User.findById(req.body.userLocation)
if(!category){
    return res.status(400).send("Invalid Category");
} 
if(!user){
    return res.status(400).send("Invalid User");
}
const file = req.file;
if(!file){
    return res.status(400).send("Image field is required");
} 


const fileName = req.file.filename;
const imagePath = `${req.protocol}://${req.get("host")}/public/productsImages/`

let product = new Product({
    name: req.body.name,
    image: `${imagePath}${fileName}`,
    images: req.body.images,
    description: req.body.description, 
    detailedDescription: req.body.detailedDescription,
    price : req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    // dateCreated: req.body.dateCreated,
    userLocation: req.body.userLocation,
})

product = await product.save();
if(!product){
    return res.status(500).send("Product could not be created");
}
return res.send(product);
})


router.put("/:id", async(req, res)=>{

if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Product Id");
}

const category = await Category.findById(req.body.category);
if(!category){
    return res.status(400).send("Invalid Category");
} 
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            images: req.body.images,
            description: req.body.description, 
            detailedDescription: req.body.detailedDescription,
            price : req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            // dateCreated: req.body.dateCreated,
            userLocation: req.body.userLocation,
        },
        {
            new: true
        }
    )
    if(!product){
        res.status(500).json({message: "the product cound not be updated"})
    }
    res.status(200).send(product)
})

router.delete("/:id",(req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
           return res.status(200).json({success: true, message: "Product deleted successfuly"})
        } else {
           return res.status(404).json({success:false, message: "Product Not deleted"})
        }
        
    }).catch(err=>{
        return res.status(400).json({success:false, error: err})
    })
})



router.get(`/get/count`, async (req, res)=>{

    const productCount = await Product.countDocuments((count)=>count);
    if(!productCount){
        res.status(500).json({success:false})
    }
    res.send({
        productCount: productCount
    })
})


router.put("/image-galery/:id", upload.array('images', 4), async(req, res)=>{

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid Product Id");
    }
    const imagePath = `${req.protocol}://${req.get("host")}/public/productsImages/`
    let paths= [];
    const files = req.files;
    if(files){
        files.map(file=>{
            
            paths.push(`${imagePath}${file.filename}`);
        })
    }
    
    const product = await Product.findByIdAndUpdate(
        req.params.id, {
           images: paths
        },
        {
            new: true
        }
    )
    if(!product){
        res.status(500).json({message: "the product cound not be updated"})
    }
    res.status(200).send(product)
})  
module.exports = router;