// Connecting to database
//Get sample from documentation
//https://expressjs.com/en/guide/database-integration.html#mysql

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'ENV.DATABASE_HOST',
    user: 'ENV.DATABASE_USER',
    password: 'ENV.DATABASE_PASSWORD',
    database: 'ENV.DATABASE_NAME'
})

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

module.exports = connection;