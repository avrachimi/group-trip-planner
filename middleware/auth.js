const db = require('../models');
const User = db['user'];

const authUser = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        next(); // FIXME: REMOVE LATER
        res.redirect('/login');
    }
};

const authAdmin = async (req, res, next) => {
    if (req.session.isAuth) {
        const user = await User.findByPk(req.session.user_id);
        if (user.is_admin) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
    else {
        res.redirect('/login');
    }
};

module.exports = {
    authUser,
    authAdmin
}