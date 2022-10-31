const db = require('../models');
const bcrypt = require('bcrypt');
const User = db['user'];

// GET /users
// Auth: Admin
const getAll = async (req, res, next) => {
    const users = await User.findAll();
    res.json(users);
};

// GET /login
// Auth: None
const getLogin = (req, res, next) => {
    if (req.session.isAuth) res.redirect('/destinations');
    res.render('login');
};

// POST /login
// Auth: None
const postLogin = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) res.render('login'); // FIXME: modify frontend to receive error and display it

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.render('login');

    req.session.isAuth = true;
    req.session.user_id = user.id;
    res.redirect('/destinations'); // FIXME: .render('/');
};

// GET /register
// Auth: None
const getRegister = async (req, res, next) => {
   res.render('register');
};

// POST /register
// Auth: None
const postRegister = async (req, res, next) => {
    // Hash password
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    }).then(json => {
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
        res.redirect('/register');
    });
};

// GET /account
// Auth: User
const getAccount = async (req, res, next) => {
    // TODO: Make sure that signed in user can only view their account, unless signed in user is admin
    const user = await User.findByPk(req.params.id);

    if (user) res.json(user);
    res.json({ message: "User not found" });
};

// GET /account/edit
// Auth: User
const getAccountEdit = (req, res, next) => {
    res.json({message:"get /account/edit"}); // FIXME:
};

// POST /account/edit
// Auth: User
const updateAccount = async (req, res, next) => {
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
        res.redirect('/account');
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
    deleteOne,
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getAccount,
    getAccountEdit,
    updateAccount
};