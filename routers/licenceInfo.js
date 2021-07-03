const express = require("express");
const { LicenceInfo } = require("../models/licenceInfo")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const router = express.Router();
const {ObjectId} = require('mongodb');


// const ObjectId = require('mongodb').ObjectId;


router.get(`/`, async (req, res) => {
    // const product = {
    //     id: 1,
    //     name: "para",
    //     image: "some_url"
    // }
    const licence = await LicenceInfo.find();
    if (!licence) {
        res.status(500).json({ success: false })
    }
    res.send(licence)
})

router.post(`/licence`, async (req, res) => {

    let licence = new LicenceInfo({
        pharmaName: req.body.pharmaName,
        LICNO: req.body.LICNO,
        // email: req.body.email,
        // passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        // isAdmin: req.body.isAdmin,
        // isPharmacy: req.body.isPharmacy,
        country: req.body.country,
        city: req.body.city,
        neighborhood: req.body.neighborhood,
        street: req.body.street,
        zip: req.body.zip
    })
    licence = await licence.save()
    if (!licence)
        return res.status(404).send("User could not be created ...");

    res.send(licence)
})


// router.get("/:id", async (req, res) => {
//     // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     //     const user = User.findOne({ _id: req.params.id }).select("-passwordHash");
//     //     if (!user) {
//     //         res.status(500).send("the user with this id cannot be found");
//     //     }
//     //     // console.log(req.params.id)
//     //     res.status(200).send(user)
//     // }
//     const id = ObjectId(req.params.id)

//     const user = await User.findById(id).select("-passwordHash");

//     if (!user) {
//         res.status(500).send("the user with this id cannot be found");
//     }
//     // console.log(req.params.id)
//     res.status(200).send(user)

// })

router.get("/:id", async (req, res)=>{
    const licence = await LicenceInfo.findById(req.params.id);

    if(!licence){
         res.status(500).send("the user with this id cannot be found");
    }
    res.status(200).send(licence)
})

// router.post("/login", async (req, res) => {
//     const secret = process.env.SECRET
//     const user = await RequestRegistration.findOne({ email: req.body.email })
//     if (!user) {
//         return res.status(400).send("User not found")
//     }
//     if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {

//         const token = jwt.sign(
//             {
//                 userId: user.id,
//                 isAdmin: user.isAdmin,
//                 isPharmacy: user.isPharmacy
//             },
            
//             secret,
//             { expiresIn: "1d" }
//         )
//         res.status(200).send({ userEmail: user.email, token: token });

//     } else {
//         res.status(400).send("Wrong Password")
        
//     }

//     // return res.send(user);
// })

router.delete("/:id", (req, res) => { 

    LicenceInfo.findByIdAndRemove(req.params.id).then(licence => {
        if (licence) {
            return res.status(200).json({ success: true, message: "User deleted successfuly" })
        } else {
            return res.status(404).json({ success: false, message: "User Not deleted" })
        }

    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

// router.get(`/get/count`, async (req, res) => {

//     const userCount = await User.countDocuments((count) => count);
//     if (!userCount) {
//         res.status(500).json({ success: false })
//     }
//     res.send({
//         userCount: userCount
//     })
// })


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