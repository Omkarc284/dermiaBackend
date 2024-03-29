const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db/mongodb');
const nodemailer = require('nodemailer')
const adminAuthMiddleware = require('../middleware/adminAuth');
const router = Router();
const getLocalDateandTime = require('../utils/localDateandTime');
const Appointment = require('../models/appointments');
const { ObjectId } = require('mongodb');
const availableSlots = require('../models/available_slots');

router.post('/new', async(req, res, next) => {
    console.log(req.body)
    const date = await getLocalDateandTime.getDate(req.body.date)
    const appointment = new Appointment()
        
    appointment.patient.name = req.body.name;
    appointment.patient.phoneNumber= req.body.phoneNumber;
    appointment.patient.email= req.body.email;
    
    appointment.branch= req.body.branch;
    appointment.date= date;
    appointment.timeSlot= req.body.timeSlot;
    appointment.bookingTime= new Date();
    appointment.status= 'Scheduled';
    
    await appointment.save().then(async (result) => {
        await availableSlots.updateOne({branch: appointment.branch, date:appointment.date},{$pull :{'slots': appointment.timeSlot}}).then((result) => {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'labs.dermia@gmail.com',
                    pass: 'oyafdmcmjkfcxsca'
                }
            })
            const mail_option = {
                from: "Dermia Labs <labs.dermia@gmail.com>",
                to: `${appointment.patient.email}`,
                subject: `Your Dermia Appointment has been booked!`,
                text: `Hello ${appointment.patient.name}, your appointment for Dermia at the ${appointment.branch} branch. \nYou'll get a reminder call before your appointment by our executives.\n\n Appointment for: ${appointment.patient.name}\n Appointment Date: ${appointment.date.toDateString()}\n Appointment time: ${appointment.timeSlot}\n Branch: ${appointment.branch}`
            };
            transporter.sendMail(mail_option, (error, info)=>{
                if (error) {
                    res.status(500).send({message: 'Failed to send Email Notification',Error: error})
                }
            })

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
    var appointments = []
    let date = new Date(getLocalDateandTime.getDate(req.body.date))
    try {
        const data = await Appointment.find({date: date})
        data.forEach(appointment => {
            appointments.push(appointment)
        })
        res.status(200).send({appointments: appointments})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error})
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
router.delete('/:id', async (req,res,next) => {
    console.log("Api hit")
    await Appointment.deleteOne({_id: new ObjectId(req.params.id)}).then(() => {
        console.log("Appointment deleted: ")
        res.status(200).json({message: `Appointment deleted`})
    }).catch(err => {
        console.log(err)
        res.status(500).send({Error:"Failed to delete the appointment", ErrorObj: err})
    })
})
module.exports = router