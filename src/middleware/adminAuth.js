const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const Admins = require('../models/admin')

const AdminAuthMiddleware = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
        const admin = await Admins.findOne({username: decoded.username, 'tokens.token': token })
        if(!admin){
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    }catch(e){
        res.status(401).send({error: 'Please Authenticate.'})
    }    

}

module.exports = AdminAuthMiddleware;