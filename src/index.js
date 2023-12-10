const express = require('express')
const app = require('./app')
const port = process.env.PORT
const mongodb = require('./db/mongodb');

mongodb.initDb((err, db) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log('Server is up on port '+ port)
        })
    }
})