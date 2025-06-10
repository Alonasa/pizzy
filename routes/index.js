const express = require("express");
const {getProducts} = require("../helpers/cache/productsCache");
const router = express.Router();


// GET home page and fill it with data from database
// Added routes to application https://expressjs.com/en/guide/routing.html
router.get("/", async (req, res) => {
    try {
        // Get products from cache or DB
        const products = await getProducts();
        // Render the main page with products
        res.render("index", {layout: "layout", products: products});
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }

});

module.exports = router;