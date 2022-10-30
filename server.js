const express = require('express');
const db = require('./helpers/database');

require('dotenv').config()

const app = express();

const port = process.env.PORT || 3000;

db.sync(true); //FIXME: should not be forced

app.get('/', (req, res) => {
    db.addUser();
    res.send();
});



app.listen(port, () => console.log(`Server running on PORT ${port}`));