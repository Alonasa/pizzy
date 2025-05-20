// Connecting to database
//Get sample from documentation
//https://expressjs.com/en/guide/database-integration.html#mysql

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'g00473376'
})

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

module.exports = connection;