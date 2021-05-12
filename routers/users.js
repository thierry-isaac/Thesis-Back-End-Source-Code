const express = require("express");
const {User} = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const router = express.Router();

router.get(`/`, async (req, res)=>{
    // const product = {
    //     id: 1,
    //     name: "para",
    //     image: "some_url"
    // }

    const user = await User.find().select("-passwordHash");
    if(!user){
        res.status(500).json({success:false})
    }
    res.send(user)
})


router.post(`/register`, async (req, res)=>{
    
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        isPharmacy: req.body.isPharmacy,
        country: req.body.country,
        city: req.body.city,
        neghborhood: req.body.neghborhood,
        street: req.body.street,
        zip: req.body.zip
    })
    user = await user.save()
    if(!user)
    return res.status(404).send("User could not be created ...");
    
    res.send(user)
})

router.get("/:id", async (req, res)=>{
    const user = await User.findById(req.params.id).select("-passwordHash");

    if(!user){
         res.status(500).send("the user with this id cannot be found");
    }
    res.status(200).send(user)
})
router.post("/login", async (req, res)=>{
  const  secret = process.env.SECRET
    const user= await User.findOne({email: req.body.email})
    if(!user){
        res.status(400).send("User not found")
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){

        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
                isPharmacy: user.isPharmacy
            },
            secret,
            {expiresIn: "1d"}
        )
        res.status(200).send({userEmail: user.email, token: token});
    }else{
        res.status(400).send("Wrong Password")
    }
    // return res.send(user);
})

router.delete("/:id",(req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
           return res.status(200).json({success: true, message: "User deleted successfuly"})
        } else {
           return res.status(404).json({success:false, message: "User Not deleted"})
        }
        
    }).catch(err=>{
        return res.status(400).json({success:false, error: err})
    })
})

router.get(`/get/count`, async (req, res)=>{

    const userCount = await User.countDocuments((count)=>count);
    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({
        userCount: userCount
    })
})


module.exports = router;



// "name": "Isaac-Langa-Langa",
// "email": "Isaac-Langa-Langa.gmail.com",
// "passwordHash": "1245pass",
// "phone": "02584558",
// "country": "Langa-Langa",
// "city": "Langa-Langa_City",
// "neghborhood": "Langa-Langa",
// "street": "Lova-Lova",
// "zip": "1457jdskj"