const express = require('express');
const path = require('path');
const db_helper = require('./helpers/database');
const db = require('./models');
const userRoutes = require('./routes/user');
const destinationRoutes = require('./routes/destination');
const voteRoutes = require('./routes/vote');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);

require('dotenv').config()

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session stuff
const store = new SessionStore({
    db: db.sequelize
});

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Setup Views and Public directories
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname + '/public')));

// Routes
app.use('/', userRoutes);
app.use('/', destinationRoutes);
app.use('/', voteRoutes);

// Sync database with models
db_helper.initialize();
db_helper.sync(); //FIXME: should not be forced

app.listen(port, () => console.log(`Server running on PORT ${port}`));