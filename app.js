const PORT = 3000;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
const helmet = require('helmet');
const express = require('express');
const app = express();
app.use(helmet( {contentSecurityPolicy: false}));
const session = require('express-session'); //module for work with sessions
const MySQLStore = require('express-mysql-session')(session);
const expressLayouts = require('express-ejs-layouts');
const connection = require("./config/db");
const routes = require('./routes/routerApp');
app.use(routes);

// Middleware to parse incoming form data and JSON
// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(expressLayouts)


//Serves all files from the `static` directory
app.use(express.static(path.join(__dirname, '/static')));

//Set ejs as main templating language
// Set the views folder for .ejs templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');


// Session middleware
const sessionStore = new MySQLStore({}, connection);
app.use(session({
    secret: 'keyboard cat', // Change this to a strong secret in production
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30} // Session cookie expiration 1 month
}));

//Make session available in templates
//Helps to identify user on all templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


// Handle 404 Not Found errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404; // Set the status code to 404
    next(error); // Pass the error to the error handler
});

// Catch and display errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if status code is not set

    // Handle 404 errors
    if (statusCode === 404) {
        return res.status(404).render('errors', {
            helper: 'f04',
            header: statusCode,
            title: '404 - Page Not Found',
            message: 'The page you\'re looking for doesn\'t exist or has been moved.',
            scripts: null
        });
    }

    // Handle server errors (500 and above)
    if (statusCode >= 500) {
        return res.status(statusCode).render('errors', {
            helper: 'f05',
            header: statusCode,
            title: `${statusCode} - Server Error Occurred`,
            message: 'We\'re sorry, but something went wrong.',
            scripts: null
        });
    }

    // Handle other errors
    res.status(statusCode).render('errors', {
        helper: '',
        header: statusCode,
        title: `${statusCode} - An Error Occurred`,
        message: err.message || 'An unexpected error occurred.',
        scripts: null
    });
});

app.listen(PORT);