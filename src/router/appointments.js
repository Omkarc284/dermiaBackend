const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db/mongodb');
const adminAuthMiddleware = require('../middleware/adminAuth');
const router = Router();
const getLocalDateandTime = require('../utils/localDateandTime');
const Appointment = require('../models/appointments');
const { ObjectId } = require('mongodb');
const availableSlots = require('../models/available_slots');

router.post('/new', async(req, res, next) => {
    const date = getLocalDateandTime.getDate(req.body.date)
    const appointment = new Appointment({
        patient:{
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
        },
        branch: req.body.branch,
        date: date,
        timeSlot: req.body.timeSlot,
        bookingTime: new Date(),
        status: 'Scheduled'
    });
    
    await appointment.save().then(async (result) => {
        await availableSlots.updateOne({branch: appointment.branch, date:appointment.date},{$pull :{'slots': appointment.timeSlot}}).then((result) => {
            res.status(201).json({message: 'Appointment created!', details: appointment})
        }).catch(err => {
            console.log(err)
            res.status(500).send({message: 'Couldnt update Available Slots',Error: err})
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({message: 'An error occured try Again!',Error: err})
    })
})

router.get('/today', async(req, res, next)=>{
    const todayDate = getLocalDateandTime.onlyDate()
    let appointments = await Appointment.find({date: todayDate})
    console.log(appointments)
    if (appointments !== undefined || null) {
        res.status(200).send({appointments: appointments})
    }else {
        res.status(500).send({Error: "Something went wrong"})
    }
})

router.post('/by_branch', async(req, res, next)=>{
    const date = getLocalDateandTime.getDate(req.body.date)
    let appointments = await Appointment.find({date: date, branch: req.body.branch})
    console.log(appointments)
    if (appointments !== undefined || null) {
        res.status(200).send({appointments: appointments})
    }else {
        res.status(500).send({Error: "Something went wrong"})
    }
})
router.post('/by_date', async(req, res, next)=>{
    const date = getLocalDateandTime.getDate(req.body.date)
    let appointments = await Appointment.find({date: date})
    console.log(appointments)
    if (appointments !== undefined || null) {
        res.status(200).send({appointments: appointments})
    }else {
        res.status(500).send({Error: "Something went wrong"})
    }
})

router.post('/update', async(req, res, next)=>{
    var updatedAppointment = new Appointment({
        _id : new ObjectId(req.body._id),
        patient: {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
        },
        date: req.body.date,
        timeSlot: req.body.timeSlot,
        bookingTime: req.body.bookingTime,
        branch: req.body.branch,
        status: req.body.status
    })
    await Appointment.updateOne({_id: updatedAppointment._id}, {$set: updatedAppointment}).then(() => {
        res.status(204).send("Updated Successfully")
    }).catch(err => {
        res.status(500).send({Error:"Failed to update the appointment", ErrorObj: err})
    })
})
router.delete('/:id',adminAuthMiddleware, async (req,res,next) => {
    await Appointment.deleteOne({_id: new ObjectId(req.body._id)}).then(() => {
        console.log("Appointment deleted: ")
        res.status(200).json({message: `Appointment deleted`})
    })
})
module.exports = router