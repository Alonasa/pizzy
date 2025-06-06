const express = require("express");//Import express
const connection = require("../config/db");
const {preventLoggedInAccess} = require("./utils/utils");
const router = express.Router(); //Created router instance and save it to variable


//GET login page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render

router.get("/", preventLoggedInAccess, (req, res) => {
    res.render("login", {
        title: "Login to Order your hot pizza",
        layout: "layout",
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
        formMessage: null,
    });
});


//POST login user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post("/", preventLoggedInAccess, (req, res) => {
    let {email, password} = req.body;
    req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;
    //Query to retrieve products from database
    const sql = `SELECT * FROM customer WHERE email = ?`;


    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp
    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send(err.message);
        // Check if user exists
        if (results.length > 0) {
            if (results[0].password === password) {
                // User is found, save user info in session
                req.session.cart = req.session.cart || [];
                req.session.user = email;
                req.session.user_id = results[0].id;// Store userid in session
                console.log("Login successful");
                return res.redirect("/user"); // Redirect to user profile
            } else {
                if (req.session.failedAttempts > 2) {
                    return res.redirect(`/restore-password?email=${email}`);
                }
                return res.redirect("/login?error=Invalid email or password.");
            }
        } else {
            // User not found 5 times redirect to register
            if (req.session.failedAttempts > 4) {
                return res.redirect("/register");
            }
            res.redirect("/login?error=Invalid email or password.");
        }
    });
});

module.exports = router;