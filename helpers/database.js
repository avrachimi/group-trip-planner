require('dotenv').config()
const Sequelize = require("sequelize");
const userModel = require('../models/user');

const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USERNAME,
 process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

// Define DB Models
const user = userModel(sequelize, Sequelize.DataTypes);

function sync(force=false) {
    sequelize.sync({force: force})
    .then(res => res)
    .then(json => {
        console.log('Models synced with database');
    });
}

function addUser(fname, lname, email, hashedPassword) {
    const newUser = user.build({
        first_name: fname,
        last_name: lname,
        email: email,
        password: hashedPassword
    });

    newUser.save().then(res => console.log(`User saved`));
}

module.exports = {
    sync,
    addUser
};