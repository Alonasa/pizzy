const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const connection = require("../config/db");

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT quantity, s.title AS size, p.title, pr.value, pi.url FROM order_items AS oi
                        INNER JOIN size s ON oi.size = s.id
                        INNER JOIN products p ON oi.product_id = p.id
                        INNER JOIN price pr ON oi.product_id = pr.product_id AND oi.size=pr.size_id
                        INNER JOIN picture pi ON p.picture_id=pi.id
                        WHERE oi.order_id=?
                       `;
    console.log("Try to get order details" + id);
    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send("Error getting order details.");
        }
        const elements = JSON.stringify(results);

        return res.json({data: results});
    });


});

module.exports = router;