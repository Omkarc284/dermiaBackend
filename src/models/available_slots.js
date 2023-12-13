const mongoose =  require('mongoose')

const available_slotsSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true
    },
    date:{
        type : Date ,
        required: true
    },
    slots:[
       String
    ]

});

const availableSlots = mongoose.model('availableSlots', available_slotsSchema);
module.exports = availableSlots;