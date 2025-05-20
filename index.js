const PORT = 3000;
const express = require('express');
//imported body parser
//https://expressjs.com/en/resources/middleware/body-parser.html
const bodyParser = require('body-parser');
const session = require('express-session'); //module for work with sessions
const path = require('path');
const indexRouter = require('./routes/index');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts



const app = express();


// livereload settlement
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const e = require("express");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + 'views/*');
app.use(connectLivereload());
app.use(expressLayouts)





app.use(bodyParser.urlencoded({ extended: true }));

//Serves all files from the `static` directory
app.use(express.static(path.join(__dirname, '/static')));

//Set ejs as main templating language
// Set the views folder for .ejs templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout', 'layout');
//Rendering index page from routes
app.use('/', indexRouter);
app.listen(PORT);

//Reload delete for production
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
