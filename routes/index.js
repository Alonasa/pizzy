const express = require('express');
const connection = require('../config/db'); // Import the database connection
const router = express.Router();


// GET home page and fill it with data from database
// Added routes to application https://expressjs.com/en/guide/routing.html
router.get('/', (req, res) => {
    //Query to retrieve products from database
    const sql = `
        (SELECT
        c.id AS category_id,
        c.title AS category_title,
        p.id AS product_id,
        p.picture_id AS picture_id,
        p.title AS product_title,
        p.description,
        s.id AS size_id,
        s.title AS size_title,
        w.value AS weight,
        pr.value AS price,
        pi.url AS picture_url,
        GROUP_CONCAT(DISTINCT ing.title ORDER BY ing.title SEPARATOR ', ') AS ingredients
        
    FROM category c
    LEFT JOIN pizza p ON c.id = p.category_id
    LEFT JOIN weight w ON w.product_id = p.id AND w.category_id = p.category_id
    LEFT JOIN size s ON s.id = w.size_id
    LEFT JOIN picture pi ON p.picture_id = pi.id
    LEFT JOIN product_ingredient pr_ing ON p.id = pr_ing.product_id
    LEFT JOIN ingredient ing ON ing.id = pr_ing.ingredient_id AND pr_ing.category_id = p.category_id
    LEFT JOIN price pr ON pr.product_id = p.id AND pr.size_id = s.id AND pr.category_id=p.category_id
    WHERE p.id IS NOT NULL
    GROUP BY 
        c.id, 
        c.title, 
        p.id, 
        p.picture_id, 
        p.title, 
        p.description, 
        s.id, 
        s.title, 
        w.value, 
        pr.value, 
        pi.url)

    UNION ALL

    (SELECT
        c.id AS category_id,
        c.title AS category_title,
        d.id AS product_id,
        d.picture_id AS picture_id,
        d.title AS product_title,
        d.description,
        NULL AS size_id,
        NULL AS size_title,
        NULL AS weight,
        pr.value AS price,
        pi.url AS picture_url,
        NULL AS ingredients
    FROM category c
    LEFT JOIN drink d ON c.id = d.category_id
    LEFT JOIN picture pi ON d.picture_id = pi.id
    LEFT JOIN price pr ON pr.product_id = d.id  AND pr.category_id=d.category_id
    WHERE d.id IS NOT NULL)

    UNION ALL

    (SELECT
        c.id AS category_id,
        c.title AS category_title,
        si.id AS product_id,
        si.picture_id AS picture_id,
        si.title AS product_title,
        si.description,
        s.id AS size_id,
        s.title AS size_title,
        w.value AS weight,
        pr.value AS price,
        pi.url AS picture_url,
        GROUP_CONCAT(DISTINCT ing.title ORDER BY ing.title SEPARATOR ', ') AS ingredients
    FROM category c
    LEFT JOIN side si ON c.id = si.category_id
    LEFT JOIN weight w ON w.product_id = si.id AND w.category_id = si.category_id
    LEFT JOIN size s ON s.id = w.size_id
    LEFT JOIN price pr ON pr.product_id = si.id AND pr.size_id = s.id AND pr.category_id=si.category_id 
    LEFT JOIN picture pi ON si.picture_id = pi.id
    LEFT JOIN product_ingredient pr_ing ON si.id = pr_ing.product_id
    LEFT JOIN ingredient ing ON ing.id = pr_ing.ingredient_id AND pr_ing.category_id = si.category_id
    WHERE si.id IS NOT NULL
    GROUP BY 
        c.id, 
        c.title, 
        si.id, 
        si.picture_id, 
        si.title, 
        si.description, 
        si.id,
        s.title,
        w.value,
        pr.value, 
        pi.url 
    )
    ORDER BY category_id, product_id, price ASC;`;

    // Send request to the database to get data
    // https://www.w3schools.com/nodejs/nodejs_mysql.asp
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).send(err.message);

        const consolidateByCategory = (data) => {
            const consolidated = {};
            //Iterate over each item and destructuring variables for future use
            data.forEach(item => {
                const {
                    category_id,
                    category_title,
                    product_id,
                    product_title,
                    description,
                    picture_url,
                    ingredients,
                    size_title,
                    size_id,
                    weight,
                    price
                } = item;

                // Initialize the category if it doesn't exist
                if (!consolidated[category_id]) {
                    consolidated[category_id] = {
                        category_id,
                        category_title,
                        products: [] // Initialize products array
                    };
                }

                // Check if the product already exists in the category
                let productEntry = consolidated[category_id].products.find(prod => prod.product_id === product_id);

                // If the product does not exist, create a new entry
                if (!productEntry) {
                    productEntry = {
                        category_id,
                        product_id,
                        product_title,
                        description,
                        picture_url,
                        price,
                        weight,
                        ingredients,
                        variations: [] // Initialize variations array for the product
                    };
                    //Add products to products array in certain category
                    consolidated[category_id].products.push(productEntry);
                }

                // Add variations if size_title and weight are valid
                if (size_title && weight !== null) {
                    productEntry.variations.push({
                        size_id,
                        size_title,
                        weight,
                        price
                    });
                }
            });
            // Convert the consolidated object back to an array
            return Object.values(consolidated);
        };

        // Call the function and get the consolidated data
        const consolidated = consolidateByCategory(results);

        // render index page and pass there data which received from database
        res.render('index', {
            layout: 'layout',
            products: consolidated
        });
    });
});

module.exports = router;