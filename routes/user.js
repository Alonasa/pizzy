const express = require('express');//Import express
const connection = require('../config/db');// Import the database connection
const router = express.Router(); //Created router instance and save it to variable


//GET register page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render

router.get('/', isAuthenticated, (req, res) => {
    //Query to retrieve products from database
    const sql = `SELECT * FROM customer WHERE email = ?;`

    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp

    const email = req.session.user;

    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send(err.message);
        // Check if user exists
        if (results.length > 0) {
            const {full_name, email, address} = results[0];

            res.render('user', {
                title: "Edit your profile",
                layout: 'layout',
                username: full_name,
                email: email,
                address: address,
                scripts: null
            });
        }
    });

});


//POST create new user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post('/', (req, res) => {
    let {full_name, phone, email, address, password} = req.body;
    //Query to retrieve products from database
    const sql = `INSERT INTO customer (full_name, phone, email, address, password)
                     VALUES (?, ?, ?, ?, ?);`

    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp
    connection.query(sql, [full_name, phone, email, address, password], (err) => {
        if (err) return res.status(500).send(err.message);
    })
    res.redirect('/user');
});

module.exports = router;