const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db/mongodb');
const router = Router();
const Branch = require('../models/branches');
const getLocalDateandTime = require('../utils/localDateandTime');
const { ObjectId } = require('mongodb');

router.get('/all', async(req,res,next) => {
    let branches = await Branch.find()
    console.log(branches)
    if (branches !== undefined || null) {
        res.status(200).send({branches: branches})
    }else {
        res.status(500).send({Error: "Something went wrong"})
    }
})

module.exports = router;