const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable
const connection = require('../config/db');
const CATEGORIES = {
    1: 'pizza',
    2: 'side',
    3: 'drink'
}


router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT DISTINCT category_id FROM order_items WHERE order_id =?`;

    connection.query(sql, [id], (err, rows) => {
        console.log(rows);
        rows.forEach(row => {
          console.log(CATEGORIES[row.category_id])
            connection.query(`SELECT * FROM ${CATEGORIES[row.category_id]}`, [row.category_id], (err, data) => {
                console.log(data);
            })
        })
    })


})

module.exports = router;