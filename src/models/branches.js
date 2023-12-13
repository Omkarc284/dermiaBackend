const mongoose =  require('mongoose')

const branchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }

});

const branches = mongoose.model('branches', branchesSchema);
module.exports = branches;