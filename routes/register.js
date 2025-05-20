const express = require('express');
const connection = require('../config/db'); // Import the database connection
const router = express.Router();


//Post create new user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post('/register', async (req, res) => {
    const { full_name, phone, email, address, password } = req.body;

    //Query to retrieve products from database
    const sql = `INSERT INTO customer (full_name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)`;

    const hashedPassword = await bcrypt.hash(password, 10);


    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp
    connection.sql(query,[full_name, phone, email, address, password], (err, results) => {
        if (err) return res.status(500).send(err.message);
    })
});

module.exports = router;