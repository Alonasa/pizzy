const connection = require('../config/db');

//Define caching variables
let productCache = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 3600000 * 24 * 30; //1month
// Send request to the database to get data and save it in cache
const fetchProducts = () => {
    //Query to retrieve products from database
    const productsQuery = `
    SELECT
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
    LEFT JOIN products p ON c.id = p.category_id
    LEFT JOIN weight w ON w.product_id = p.id
    LEFT JOIN size s ON s.id = w.size_id
    LEFT JOIN picture pi ON p.picture_id = pi.id
    LEFT JOIN product_ingredient pr_ing ON p.id = pr_ing.product_id
    LEFT JOIN ingredient ing ON ing.id = pr_ing.ingredient_id
    LEFT JOIN price pr ON pr.product_id = p.id AND pr.size_id = s.id
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
    ORDER BY category_id, product_id, price ASC;`;

    return new Promise((resolve, reject) => {
        connection.query(productsQuery, (err, results) => {
            if (err) return reject(err);
            productCache = consolidateByCategory(results);
            lastFetchTime = Date.now();
            resolve(results);
        });
    });
};


// Consolidate products by categories
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

// Update products if the cache expired
const getProducts = async () => {
    const currentTime = Date.now();
    if (!productCache || (currentTime - lastFetchTime > CACHE_EXPIRY)) {
        await fetchProducts();
    }

    return productCache;
};

module.exports = {
    getProducts
};