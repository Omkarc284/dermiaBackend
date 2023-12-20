const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db/mongodb');
const router = Router();
const Branch = require('../models/branches');
const Slots = require('../models/available_slots')
const getLocalDateandTime = require('../utils/localDateandTime');
const { ObjectId } = require('mongodb');

router.post('/per_branch', async(req,res,next) => {
    const date = await getLocalDateandTime.getDate(req.body.date)

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
    var arr = [];
    const date = getLocalDateandTime.onlyDate()
    var available_slots = new Slots({
        branch : 'Kharghar',
        date : date,
        slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
    })
    arr.push(available_slots);

    var available_slots1 = new Slots({
        branch : 'Andheri',
        date : date,
        slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
    })
    arr.push(available_slots1);
    var available_slots2 = new Slots({
        branch : 'Malad',
        date : date,
        slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
    })
    arr.push(available_slots2);
    await Slots.insertMany(arr).then(()=>{
        res.status(201).send({message: 'Slots Added'})
    }).catch((err)=>{
        res.status(500).send({Error: err})
    })
    
   
});
router.post('/populate_week', async(req,res,next) => {
    var arr = [];
    var date = getLocalDateandTime.nextDate(new Date())
    for(let i = 0; i < 7; i++) {
        var available_slots = new Slots({
            branch : 'Kharghar',
            date : date,
            slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
        })
        arr.push(available_slots);

        var available_slots1 = new Slots({
            branch : 'Andheri',
            date : date,
            slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
        })
        arr.push(available_slots1);
        var available_slots2 = new Slots({
            branch : 'Malad',
            date : date,
            slots : ['9','9.30','10', '10:30', '11', '11:30', '12', '12:30', '1:30', '2', '2:30', '3', '3:30']
        })
        arr.push(available_slots2);
        date = getLocalDateandTime.nextDate(date)
    }
    
    await Slots.insertMany(arr).then(()=>{
        res.status(201).send({message: 'Slots Added'})
    }).catch((err)=>{
        res.status(500).send({Error: err})
    })
    
   
});
router.get('/enabled_data', async(req, res, next) => {
    let enabled_dates = new Set()
    let data = [];
    const arr = await Slots.find()
    arr.forEach(doc => {
        const d = getLocalDateandTime.dateString(doc.date)
        enabled_dates.add(d)
        data.push(doc)
    })
    const enabled = Array.from(enabled_dates)
    res.status(200).send({enabled: enabled, data: data})
    
})

module.exports = router