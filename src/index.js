const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const route = require('./routes');
const db = require('./config/db');
const SessionMiddleware = require('./app/middlewares/SessionMiddleware');

const app = express();

// Connect DB
db.connect();

//Method override
app.use(methodOverride('_method'));

const port = 3000;

// app.use(morgan('combined')); // HTTP logger
app.use(express.static(path.join(__dirname,'resources', 'public'))); // Static file
app.use(express.json()); // Body-parsing
app.use(express.urlencoded({ extended: true })); // Body-parsing
app.use(cookieParser('abcdefggfedcba')); // Cookie-parse

app.use(SessionMiddleware.session);

// Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: {
    sum: (a,b) => a + b,
}
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})