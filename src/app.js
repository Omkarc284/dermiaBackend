const path = require('path');
require('./db/mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./router/adminauth')
const appointmentRouter = require('./router/appointments')
const slotRouter = require('./router/slots')
const branchRouter = require('./router/branches')
const cors = require('cors')
const app = express();

const corsOptions = {
  origin: 'http://localhost:5501/',
  optionsSuccessStatus: 200,
}

app.use(cors());

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use((req, res, next) => {
    // Set CORS headers so that the React SPA is able to communicate with this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    next();
});
app.options('/appointments', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
app.options('/admin', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
app.options('/slots', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
app.options('/branch', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

app.use('/appointments', appointmentRouter);
app.use('/admin', adminRouter);
app.use('/slots', slotRouter);
app.use('/branch', branchRouter)

module.exports = app;