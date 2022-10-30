const express = require('express');
const db_helper = require('./helpers/database');
const userRoutes = require('./routes/user');

require('dotenv').config()

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded());
app.use(express.json());

app.use('/', userRoutes);

db_helper.initialize();
db_helper.sync(true); //FIXME: should not be forced

app.listen(port, () => console.log(`Server running on PORT ${port}`));