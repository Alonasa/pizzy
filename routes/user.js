const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
// Import the database connection
const connection = require("../config/db");


//Middleware to check if user is authenticated
//Will be exported to access in some modules
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // Redirect to login page if not authenticated
    return res.redirect("/login");
}


//GET user page
// in render body we pass parameters for the page,
// at formFieldsConfig turning on form fields on our page
//at scripts we pass scripts if our page need them other ways null
// Made from sample: https://expressjs.com/en/5x/api.html#res.render
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const user_email = req.session.user;
        let customer = await getCustomer(user_email);
        const {full_name, email, address} = customer;

        //Pagination parameters
        const LIMIT = 5;
        //get current page from query string
        const page = parseInt(req.query.page, 10) || 1;
        const offset = (page - 1) * LIMIT;

        let orders = await getOrdersStatistic(req.session.user_id);
        let {total, sum} = orders[0];
        const totalPages = Math.ceil(total / LIMIT);

        const ordersList = await getOrders(req.session.user_id, LIMIT, offset);
        res.render("user", {
            title: "Edit your profile",
            layout: "layout",
            username: full_name,
            email: email,
            address: address,
            orders: ordersList,
            ordersTotal: total,
            ordersTotalAmt: sum,
            pagesCount: totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Failed to get orders:", err.message);
    }

});


//POST create new user
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post("/", (req, res) => {
    let {full_name, phone, email, address, password} = req.body;
    //Query to retrieve products from database
    const sql = `INSERT INTO customer (full_name, phone, email, address, password)
                     VALUES (?, ?, ?, ?, ?);`;

    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp
    connection.query(sql, [full_name, phone, email, address, password], (err) => {
        if (err) return res.status(500).send(err.message);
    });
    res.redirect("/user");
});

// Route to handle user details update
router.post("/update", isAuthenticated, async (req, res) => {
    try {
        const { full_name, address, phone } = req.body;
        const user_id = req.session.user_id;

        try {
            const updateSql = `
                UPDATE customer 
                SET ${full_name && 'full_name = ?'}${address && ', address = ?'}${phone && ', phone = ?'} 
                WHERE id = ${user_id}
            `;

            const params = phone 
                ? [full_name, address, phone]
                : [full_name, address];

            const result = await new Promise((resolve, reject) => {
                connection.query(updateSql, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "User not found" 
                });
            }

            return res.status(200).json({ 
                message: "User details updated successfully" 
            });
        } catch (err) {
            console.error("Error updating user details:", err);
            return res.status(500).json({ 
                message: "Error updating user details" 
            });
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ 
            message: "Server error while updating user details" 
        });
    }
});


const getOrdersStatistic = (customerId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Count(*) AS total, SUM(order_summ) AS sum FROM \`order\` WHERE customer_id = ?`;
        connection.query(sql, [customerId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


const getOrders = (customerId, limit, offset) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM \`order\` WHERE customer_id = ? ORDER BY id DESC LIMIT ? OFFSET ?;`;
        connection.query(sql, [customerId, limit, offset], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


const getCustomer = (email) => {
    return new Promise((resolve, reject) => {
        //Query to retrieve user from database
        const sql = `SELECT * FROM customer WHERE email = ?;`;

        // Send request to the database to get data
        // https://www.w3schools.com/nodejs/nodejs_mysql.asp

        connection.query(sql, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) {
                return resolve(results[0]);
            } else {
                return resolve(null);
            }
        });
    });
};

// Check if email exists for another user
const checkEmailExists = (email, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM customer WHERE email = ? AND id != ?";
        connection.query(sql, [email, userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0);
        });
    });
};


module.exports = router;
