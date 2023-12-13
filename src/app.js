const path = require('path');
require('./db/mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./router/adminauth')
const appointmentRouter = require('./router/appointments')
const slotRouter = require('./router/slots')
const branchRouter = require('./router/branches')
const app = express();


app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use((req, res, next) => {
    // Set CORS headers so that the React SPA is able to communicate with this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/appointments', appointmentRouter);
app.use('/admin', adminRouter);
app.use('/slots', slotRouter);
app.use('/branch', branchRouter)

module.exports = app;