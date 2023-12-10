const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config()

const url = process.env.MONGODB_URI

let _db;

const initDb = callback => {
    if(_db) {
        console.log('Database already initialized!!')
        return callback(null, _db);
    }
    MongoClient.connect(url).then(client => {
        _db = client;
        console.log('Connected to KMS!')
        callback(null, _db);
    }).catch(err => {
        callback(err);
    })
}

const getDb = () => {
    if (!_db) {
        throw Error('Database not initialized')
    }
    return _db;
}

module.exports = {
    initDb,
    getDb
};