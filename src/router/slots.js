const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db/mongodb');
const router = Router();
const Branch = require('../models/branches');
const Slots = require('../models/available_slots')
const getLocalDateandTime = require('../utils/localDateandTime');
const { ObjectId } = require('mongodb');

router.post('/per_branch', async(req,res,next) => {
    const date = getLocalDateandTime.getDate(req.body.date)

    var available_slots = await Slots.findOne({branch: req.body.branch, date: date})
    if(available_slots.slots.length > 0){
        res.status(200).send({available_slots: available_slots.slots})
    } else if (available_slots.slots.length == 0){
        res.status(200).send({available_slots: 0, message: 'No slots available book for another day'})
    } else {
        res.status(500).send({message: 'An error occcured!'})
    }
});
router.post('/populate', async(req,res,next) => {
    const date = getLocalDateandTime.onlyDate()
    var available_slots = new Slots({
        branch : 'Karghar',
        date : date,
        slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
    })
    await available_slots.save();
    available_slots.branch = 'Andheri';
    await available_slots.save();
    available_slots.branch = 'Malad';
    await available_slots.save();
    res.status(201).send({message: 'Slots Added'})
   
});

module.exports = router