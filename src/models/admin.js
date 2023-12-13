const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { type: String, required: true},
    contact: { type: String, required: true},
    date_created: { type: String, required: true },
    time_created: { type: String, required: true },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});
const admin = mongoose.model('admins', adminSchema);


adminSchema.methods.toJSON = function() {
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens
    return adminObject
}


adminSchema.pre('save', async function (next){
    const admin = this
    if (admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 12)
    }
    next()
})

module.exports = admin;