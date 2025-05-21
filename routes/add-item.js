const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable


//POST add to cart
// Added routes to application https://expressjs.com/en/guide/routing.html
router.post('/', (req, res) => {
    // Check if the request body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('No item data provided.');
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push(req.body);
    console.log(req.session.cart);

    //Send feedback that item added to cart
    res.status(200).send('Item added to cart.');
});

module.exports = router;