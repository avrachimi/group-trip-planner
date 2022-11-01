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
    if (!user) return res.redirect('/login'); // FIXME: modify frontend to receive error and display it
    console.log(user);
    //if (!user.password) res.redirect('/login');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.render('login');

    req.session.isAuth = true;
    req.session.user_id = user.id;
    res.redirect('/destinations');
};

// POST /logout
// Auth: User
const postLogout = (req, res, next) => {
    req.session.isAuth = false;
    req.session.user_id = null;
    res.redirect('/login');
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
    }).then(() => {
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
    const user = await User.findByPk(req.session.user_id);

    if (!user) return res.redirect('/login');

    res.render('account', { user: user });
};

// GET /account/edit
// Auth: User
const getAccountEdit = async (req, res, next) => {
    // TODO: Make sure that signed in user can only view their account, unless signed in user is admin
    const user = await User.findByPk(req.session.user_id);

    if (!user) return res.redirect('/login');

    res.render('account_edit', { user: user });
};

// PUT /account/edit
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
            id: req.session.user_id
        }
    }).then(() => {
        console.log(`User ${req.body.email} has been updated succesfully`);
        res.redirect('/account');
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong with user update" });
    });
};

// DELETE /account
const deleteAccount = (req, res, next) => {
    // TODO: Make sure that signed in user can only delete their own account, unless signed in user is admin
    User.destroy({
        where: {
            id: req.session.user_id
        }
    }).then(() => {
        console.log(`Deleted user with Id ${req.params.id}`);
        req.session.isAuth = false;
        req.session.user_id = null;
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
        res.redirect('/account');
    });

};

module.exports = {
    getAll,
    getLogin,
    postLogin,
    postLogout,
    getRegister,
    postRegister,
    getAccount,
    getAccountEdit,
    updateAccount,
    deleteAccount
};