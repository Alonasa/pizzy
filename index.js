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
const errRouter = require('./routes/404');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts

const app = express();

// Middleware to parse incoming form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// livereload settlement
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const e = require('express');
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

// Defined Routes
app.use('/', indexRouter); //root
app.use('/register', registerRouter);//register
app.use('/login', loginRouter);//login



// Catch-all error handling and return 404
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found',
        message: 'The page you\'re looking for doesn\'t exist or has been moved.',
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
