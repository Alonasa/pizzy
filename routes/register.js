const express = require('express');//Import express
const connection = require('../config/db'); // Import the database connection
const router = express.Router(); //Created router instance and save it to variable


//GET register page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render

router.get('/', (req, res) => {
    res.render('register', {
        title: "Register to Order your hot pizza",
        layout: 'layout',
        formFieldsConfig: {
            showFullName: true,
            showPhone: true,
            showEmail: true,
            showAddress: true,
            showPassword: true,
            showConfirmPassword: true
        },
        formTitle: "Register",
        formMethod: "POST",
        formAction: "/register",
        formId: "registerForm",
        scripts: null
    });
});


//POST create new user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post('/', (req, res) => {
    let {full_name, phone, email, address, password} = req.body;
    if (connection) {
        //Query to retrieve products from database
        const sql = `INSERT INTO customer (full_name, phone, email, address, password)
                     VALUES (?, ?, ?, ?, ?);`


        // Send request to the database to get data
        // https://www.w3schools.com/nodejs/nodejs_mysql.asp
        connection.query(sql, [full_name, phone, email, address, password], (err) => {
            if (err) return res.status(500).send(err.message);
        })
        res.redirect('/');
    }
});

module.exports = router;