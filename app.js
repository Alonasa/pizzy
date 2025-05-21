const PORT = 3000;
const express = require('express');
//imported body parser
//https://expressjs.com/en/resources/middleware/body-parser.html
const bodyParser = require('body-parser');
const session = require('express-session'); //module for work with sessions
const path = require('path');
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const addToCartRouter = require('./routes/add-item');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts

/**
 * The `app` variable represents an instance of an Express application.
 * It is used to configure the application's middleware, routes, and behavior.
 * The `app` instance is the central component for handling HTTP requests
 * and defining server functionality in an Express.js application.
 */
const app = express();

// Middleware to parse incoming form data and JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// livereload settlement
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
/**
 * Represents a LiveReload server instance created using the `livereload` library.
 * The LiveReload server listens for changes in the file system and automatically
 * refreshes connected clients' web pages when changes are detected.
 *
 * This object is used to manage the LiveReload server instance and can be configured
 * to monitor specific files or directories for updates, providing a more efficient
 * development workflow by enabling real-time browser reloading.
 *
 * It relies on the livereload library to create and configure the server.
 *
 * @type {Object}
 */
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + 'views/*');
app.use(connectLivereload());
app.use(expressLayouts)

//Serves all files from the `static` directory
app.use(express.static(path.join(__dirname, '/static')));

//Set ejs as main templating language
// Set the views folder for .ejs templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');


// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Session middleware
app.use(session({
    secret: 'keyboard cat', // Change this to a strong secret in production
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30} // Session cookie expiration 1 month
}));


//Middleware to check if user is authenticated
//Will be exported to access in some modules
/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, proceeds to the next middleware or route handler.
 * If not authenticated, redirects the user to the login page.
 *
 * @param {Object} req - The HTTP request object, which contains the session and user data.
 * @param {Object} res - The HTTP response object used to manage the HTTP response.
 * @param {Function} next - The next middleware or route handler to be executed.
 * @return {void}
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // Redirect to login if not authenticated
    res.redirect('/login');
}


//Make session available in templates
//Helps to identify user on all templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


// Defined Routes
app.use('/', indexRouter); //root
app.use('/register', registerRouter);//register
app.use('/login', loginRouter);//login
app.use('/user', userRouter);//user profile
app.use('/add-item', addToCartRouter);//adding to cart


// Catch-all route for 404 errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404; // Set the status code to 404
    next(error); // Pass the error to the error handler
});


// Catch errors display
app.use((err, req, res, next) => {
    const statusCode = err.statusCode;
    // Catch-all error handling and return 404
    if (statusCode === 404) {
        res.status(404).render('errors', {
            helper: 'f04',
            header: statusCode,
            title: '404 - Page Not Found',
            message: 'The page you\'re looking for doesn\'t exist or has been moved.',
            layout: 'layout',
            scripts: null
        });
    }

    //Catch Server errors
    if (err.statusCode >= 500 && err.statusCode < 600) {
        return res.status(statusCode).render('errors', {
            helper: 'f05',
            header: statusCode,
            title: `${statusCode} - Server Error Occurred`,
            message: 'We\'re sorry, but something went wrong.',
            layout: 'layout',
            scripts: null
        });
    }
});


app.listen(PORT);

//Reload delete for production
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


module.exports = isAuthenticated;
