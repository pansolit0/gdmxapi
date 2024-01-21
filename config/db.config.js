const db  = require('mysql');
require('dotenv').config();

const pool = db.createConnection({
    host: process.env.SERVERNAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
})

module.exports = pool

