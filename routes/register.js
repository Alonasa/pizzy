const express = require("express");//Import express
const connection = require("../config/db"); // Import the database connection
const router = express.Router(); //Created router instance and save it to variable
const {body, validationResult} = require("express-validator");
const {preventLoggedInAccess} = require("./utils/utils");


//GET register page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render

router.get("/", preventLoggedInAccess, (req, res) => {
    res.render("register", {
        title: "Register to Order your hot pizza",
        layout: "layout",
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
        formMessage: null,
    });
});


//POST create new user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post("/", preventLoggedInAccess, [body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 5}).withMessage("Password must be at least 5 characters long"),
    body("confirm-password")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
], (req, res) => {
    let {full_name, phone, email, address, password} = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } else {
        // Send request to the database to set data
        // https://www.w3schools.com/nodejs/nodejs_mysql.asp
        const insertQuery = "INSERT INTO customer (full_name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";
        connection.query(insertQuery, [full_name, phone, email.trim(), address, password.trim()], (err) => {
            if (err) {
                return res.redirect("/login");
            }
            req.session.user = email;
            return res.status(200).json({message: "User registered successfully", redirect: "/user"});
        });
    }
});

module.exports = router;