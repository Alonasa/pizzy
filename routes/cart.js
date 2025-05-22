const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable


//GET cart items
// Added routes to application https://expressjs.com/en/guide/routing.html
router.get('/', (req, res) => {
    // Check if the request body is not empty
    console.log(req.session);
    console.log("CART")
    if (!req.session.cart) {
        return res.status(400).send('No items in cart.');
    }

    console.log(req.session.cart);
    console.log(req.session.user_id);
    const cartItems = req.session.cart || [];
    if (cartItems.length === 0) {
        return res.render('shopping-cart', {cartItems: []});
    }

    // Send the cart data
    res.render('shopping-cart', {cartItems, layout: false });
});

module.exports = router;