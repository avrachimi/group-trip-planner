const express = require('express');
const db_helper = require('./helpers/database');
const userRoutes = require('./routes/user');
const destinationRoutes = require('./routes/destination');
const voteRoutes = require('./routes/vote');

require('dotenv').config()

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoutes);
app.use('/', destinationRoutes);
app.use('/', voteRoutes);

db_helper.initialize();
db_helper.sync(); //FIXME: should not be forced

app.listen(port, () => console.log(`Server running on PORT ${port}`));