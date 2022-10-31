const db = require('../models');
const bcrypt = require('bcrypt');
const User = db['user'];

// GET /users
const getAll = async (req, res, next) => {
    const users = await User.findAll();
    res.json(users);
};

// POST /users
const createOne = async (req, res, next) => {
    // Hash password
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    }).then(json => {
        res.json(json);
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong." });
    });
};

// GET /users/:id˝
const getOne = async (req, res, next) => {
    // TODO: Make sure that signed in user can only view their account, unless signed in user is admin
    const user = await User.findByPk(req.params.id);

    if (user) res.json(user);
    res.json({ message: "User not found" });
};

// PUT /users/:id
const updateOne = async (req, res, next) => {
    // TODO: Make sure that signed in user can only update their account, unless signed in user is admin
    // Hash password
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`User ${req.body.email} has been updated succesfully`);
        res.json({ message: `User ${req.body.email} has been updated succesfully` });
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong with user update" });
    });
};

// DELETE /users/:id
const deleteOne = (req, res, next) => {
    // TODO: Make sure that signed in user can only delete their own account, unless signed in user is admin
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Deleted user with Id ${req.params.id}`);
        res.json({ message: `Deleted user with Id ${req.params.id}` });
    }).catch(err => {
        console.log(err);
        res.json({ message: `Could not delete user with Id ${req.params.id}. Something went wrong` });
    });

};

module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
};