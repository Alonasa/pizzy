const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable


//Post remove item
router.post("/", (req, res) => {
    const {product_id, category_id} = req.body; // Get both IDs from the request
    const cartItems = req.session.cart || [];

    // Find the index of the item to remove
    const itemIndex = cartItems.findIndex(item =>
        item.product_id === product_id && item.category_id === category_id
    );

    if (itemIndex === -1) {
        return res.status(404).send("Item not found in cart.");
    }

    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
    req.session.cart = cartItems;

    res.status(200).send("Item removed from cart successfully.");
});

module.exports = router;