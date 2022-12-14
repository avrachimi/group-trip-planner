'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const mysql = require('mysql2/promise');

// Create db if it doesn't already exist
const host = process.env.DB_HOST, 
      port = process.env.DB_PORT, 
      user = process.env.DB_USERNAME, 
      password = process.env.DB_PASSWORD, 
      database = process.env.DB_NAME,
      dialect = process.env.DB_DIALECT;

mysql.createConnection({ host, port, user, password }).then(connection => {
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`).then(() => console.log('Created database ' + database));

});

let sequelize;
sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: dialect
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
