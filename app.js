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
const removeFromCartRouter = require('./routes/remove-item');
const getCartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts
const app = express();

// Middleware to parse incoming form data and JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// livereload settlement
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
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
app.use('/', indexRouter);//root
app.use('/register', registerRouter);//register
app.use('/login', loginRouter);//login
app.use('/user', userRouter);//user profile
app.use('/add-item', addToCartRouter);//adding to cart
app.use('/remove-item', removeFromCartRouter);//remove from cart
app.use('/cart', getCartRouter);//get items for cart
app.use('/checkout', checkoutRouter);//checkout


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
            layout: 'layout',
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
            layout: 'layout',
            scripts: null
        });
    }

    // Handle other errors
    res.status(statusCode).render('errors', {
        helper: '',
        header: statusCode,
        title: `${statusCode} - An Error Occurred`,
        message: err.message || 'An unexpected error occurred.',
        layout: 'layout',
        scripts: null
    });
});



app.listen(PORT);

//Reload delete for production
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


module.exports = isAuthenticated;
