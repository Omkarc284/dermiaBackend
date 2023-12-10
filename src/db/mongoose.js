const mongoose = require('mongoose')
require('dotenv').config()
const uri = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(uri,{}).catch(error => console.log("Database connection failed :", error))