const Router = require('express').Router;
require('dotenv').config()
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin')
const db = require('../db/mongodb');
const router = Router();
const getLocalDateandTime = require('../utils/localDateandTime');
const adminAuthMiddleware = require('../middleware/adminAuth');



router.post("/signup", async (req, res, next)=> {
    if(req.body.master_phrase !== process.env.MASTER_PHRASE) {
        res.status(404).send({message: 'Not Found!'});
        return
    }
        const pw = req.body.password;
        const hashedPw = await bcrypt.hash(pw, 12)
        var admin = new Admin({
            username : req.body.username,
            password: hashedPw,
            contact: req.body.contact,
            date_created: getLocalDateandTime.getlocalDate(),
            time_created: getLocalDateandTime.getlocalTime()
        });
        // const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET_ADMIN, { expiresIn: "4h"})
        // admin.tokens = admin.tokens.concat({token})
        await admin.save().then((result)=>{
            console.log(result)
            res.status(200).json({message: 'Admin User created!', adminUser: admin})
        }).catch(err => {
            console.log(err)
            res.status(200).send({message: 'An error occured try Again!',Error: err})
        })
    
    
});

router.post("/login", async (req, res, next)=> {
    const expirationTime = getLocalDateandTime.getexpirationTime(82800000)
    try{
        var admin = await Admin.findOne({username: req.body.username})
        const isMatch = await bcrypt.compare(req.body.password, admin.password)
        if(!admin){
            return res.status(404).json({message: 'Auth Failed!'})
        }
        if(!isMatch){
            return res.status(401).json({message: 'Wrong Credentials!'})
        };
        const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET_ADMIN, { expiresIn: "23h"})
        admin.tokens = admin.tokens.concat({token})
        await admin.save().then(()=>{
            res.status(200).json({
                message: 'Authentication successful',
                token: token,
                adminUser: admin,
                expiresIn: expirationTime
            })
        }).catch(err => {
            res.status(500).send({message: 'An error occured try Again!', Error: err})
        })
    }catch(e){
        res.status(500).send({message: 'An error occured try Again!'})
    }
});
router.get("/me", adminAuthMiddleware, async(req, res, next) => {
    try{
        var admin = await Admin.findOne({username: req.admin.username})
        res.status(200).json({message: admin})
    }catch(e){
        res.status(404).send({Error: err})
    }
    
})
router.patch("/me", adminAuthMiddleware, async (req, res, next) => {
    var pass = req.body.password
    var admin = await Admin.findOne({username: req.body.username})
    const isMatch = await bcrypt.compare(pass, admin.password)
    if(!admin){
        return res.status(404).json({message: 'Username not found!'})
    }
    if(!isMatch){
        return res.status(401).json({message: 'Wrong Credentials!'})
    };
    if(req.body.new_password) {
        const pw = req.body.new_password;
        pass = await bcrypt.hash(pw, 12)
    }
    
    var updatedadmin = new Admin({
        _id: admin._id,
        username : req.body.username,
        password: pass,
        contact: req.body.contact,
        tokens: admin.tokens
    });
    await Admin.updateOne({_id: admin._id}, {$set: updatedadmin}).then(() => {
        res.status(200).json({
            message: 'User updated',
            AdminUser: updatedadmin.username
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: "An error occured!",
            Error: err
        })
    })
})

router.post("/logout", adminAuthMiddleware, async (req, res, next) => {
    try{
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        const admin = req.admin
        await req.admin.save().then(() => {
            res.status(200).json({message: 'Logged out Succesfully'})
        }).catch(err => {
            return err
        })
    }catch(error){
        res.status(500).json({Error: error})
    }
})

module.exports = router;