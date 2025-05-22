const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable
const connection = require('../config/db'); // Import the database connection


//Post make order
// Added routes to application https://expressjs.com/en/guide/routing.html
router.get('/', (req, res) => {
    console.log(req.session)
    const customerId = session.user_id; // Get customer ID from session
    const cartItems = session.cart || []; // Get cart items from session

    if (!customerId) {
        return res.status(400).send('Customer ID not found.');
    }

    if (cartItems.length === 0) {
        return res.status(400).send('No items in cart.');
    }

    // Calculate order sum
    const orderSum = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const orderDate = new Date(); // Current date
    const comment = req.body.comment || ''; // Any comment from the user
    const newAddress = req.body.address || ''; // New address if provided

    // Insert order into orders table
    const insertOrderQuery = `
        INSERT INTO orders (customer_id, order_sum, order_date, comment, new_address)
        VALUES (?, ?, ?, ?, ?);
    `;
    const orderValues = [customerId, orderSum, orderDate, comment, newAddress];
    console.log(session.cart)

    connection.query(insertOrderQuery, orderValues, (error, results) => {
        if (error) {
            console.error('Error inserting order:', error);
            return res.status(500).send('Error processing order.');
        }

        const orderId = results.insertId; // Get the ID of the newly inserted order

        // Insert order items
        insertOrderItems(orderId, cartItems, res, req);
    });
});

// Function to insert order items
function insertOrderItems(orderId, cartItems, res, req) {
    const insertOrderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, category_id, size) 
        VALUES (?, ?, ?, ?, ?);
    `;

    cartItems.forEach(item => {
        const orderItemValues = [orderId, item.product_id, item.quantity, item.category_id, item.size];
        connection.query(insertOrderItemsQuery, orderItemValues, (error) => {
            if (error) {
                console.error('Error inserting order item:', error);
                return res.status(500).send('Error processing order items.');
            }
        });
    });

    // Clear the cart after processing the order
    session.cart = []; // Clear the cart
    res.status(200).send('Order placed successfully!'); // Send success message
}

module.exports = router;