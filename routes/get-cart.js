const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable


//POST add to cart
// Added routes to application https://expressjs.com/en/guide/routing.html
router.get('/', (req, res) => {
    // Check if the request body is not empty
    if (!req.session.cart) {
        return res.status(400).send('No items in cart.');
    }

    req.session.cart.push(req.body);
    console.log(req.session.cart);

    // Send the cart data
    res.status(200).json(req.session.cart);
});

module.exports = router;