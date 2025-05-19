const PORT = 3000;
const express = require("express");
const app = express();

// livereload settlement
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/static");
app.use(connectLivereload());

// main files for server
app.use(express.static('static'));
app.listen(PORT);

// reload delete for production
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});


// Connecting database
// https://expressjs.com/en/guide/database-integration.html#mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'g00473376'
})

module.exports = connection;


// GET all products from database
app.get('/api/catalog', (req, res) => {
    const query = `
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
        pi.url
)

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
    WHERE d.id IS NOT NULL
)

UNION ALL

(
        SELECT
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
ORDER BY category_id, product_id, price ASC
;
`;

    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err.message);
        return res.json(results);
    });

});


// Added routes to application https://expressjs.com/en/guide/routing.html

app.get("/login", (req, res) => {
    console.log("login");
});