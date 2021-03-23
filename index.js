const express = require('express');
const app = express();
const config = require('config');
const getUserName = require('./models/User').getUserName;
const errorHandler = require('./middlewares/errorHandler');
require('express-async-errors');
const helmet = require('helmet');

//view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//error Handlers
require('./startup/errorHandlers')();

//database startUp
require('./startup/db')();

//importing router
require('./startup/routers')(app);

const port = process.env.port || config.get('port');
app.listen(port , ()=> {console.log('listeing to 5050')});


