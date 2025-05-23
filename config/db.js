

// Connecting to database
//Get sample from documentation
//https://expressjs.com/en/guide/database-integration.html#mysql

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

module.exports = connection;