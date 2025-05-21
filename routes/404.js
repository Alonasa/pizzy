const express = require('express');//Import express
const connection = require('../config/db'); // Import the database connection
const router = express.Router(); //Created router instance and save it to variable


//GET 404 page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render
router.get('/', (req, res) => {
    res.render('404', {
        title: "Oops! Page not found",
        layout: 'layout',
        scripts: null
    })
})