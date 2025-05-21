const express = require('express');//Import express
const connection = require('../config/db'); // Import the database connection
const router = express.Router(); //Created router instance and save it to variable


//GET login page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render

router.get('/', (req, res) => {
    res.render('login', {
        title: "Login to Order your hot pizza",
        layout: 'layout',
        formFieldsConfig: {
            showFullName: false,
            showPhone: false,
            showEmail: true,
            showAddress: false,
            showPassword: true,
            showConfirmPassword: false
        },
        formTitle: "Login",
        formMethod: "POST",
        formAction: "/login",
        formId: "loginForm",
        scripts: null
    });
});


//POST login user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post('/', (req, res) => {
    let {full_name, phone, email, address, password} = req.body;
    if (connection) {
        //Query to retrieve products from database
        const sql = `SELECT * FROM customer WHERE email = ? AND password = ?;`


        // Send request to the database to get data
        // https://www.w3schools.com/nodejs/nodejs_mysql.asp
        connection.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).send(err.message);
            console.log(results);
        })

    }
});

module.exports = router;