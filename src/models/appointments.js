const mongoose =  require('mongoose')

const appointmentsSchema = new mongoose.Schema({
   patient: {
    name: {
        type:String,
        required:true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
   },
   branch:{
    type: String,
    required:true
   },
   bookingTime: {
    type: Date,
    required: true
   },
   date: {
    type:Date,
    required: true
   },
   timeSlot: {
    type: String,
    required: true
   },
   status: {
    type: String,
    required: true
   }

});

const Appointment = mongoose.model('appointments', appointmentsSchema);
module.exports = Appointment;