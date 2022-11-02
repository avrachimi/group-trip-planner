const db = require('../models');
const Destination = db['destination'];
const User = db['user'];

// GET /destinations
// Auth: User
const getDestinations = async (req, res, next) => {
    const destinations = await Destination.findAll();
    res.render('destinations', { destinations: destinations });
};

// GET /destinations/new
// Auth: User
const getDestinationsNew = (req, res, next) => {
    res.render('destination_new');
};

// POST /destinations/new
// Auth: User
const postDestinationsNew = async (req, res, next) => {
    const user_id = req.session.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.redirect('/login');

    Destination.create({
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        budget: req.body.budget,
        nights_stay: req.body.nights_stay,
        user_id: user.id
    }).then(json => {
        res.redirect(`/destinations/${json.id}`);
    }).catch(err => {
        console.log(err);
        res.render('destination_new', { message: "Something went wrong. Please try again." });
    });
};

// GET /destinations/:id
// Auth: User
const getDestination = async (req, res, next) => {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.redirect('/destinations');

    res.render('destination_view', { destination: destination, isOwner: req.session.user_id === destination.user_id });
};

// GET /destinations/:id/edit
// Auth: User
const getDestinationEdit = async (req, res, next) => {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.redirect('/destinations');

    res.render('destination_edit', { destination: destination });
};

// PUT /destinations/:id/edit
// Auth: User
const updateDestination = async (req, res, next) => {
    const body = {
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        budget: req.body.budget,
        nights_stay: req.body.nights_stay
    };

    Destination.update(body, {
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    }).then(() => {
        console.log(`Destination (id:${req.params.id}) has been updated succesfully`);
        return res.redirect(`/destinations/${req.params.id}`);
    }).catch(err => {
        console.log(err);
        return res.redirect(`/destinations/${req.params.id}/edit`);
    });
};

// DELETE /destinations/:id
// Auth: User
const deleteDestination = (req, res, next) => {

    Destination.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    }).then(() => {
        console.log(`Deleted destination with Id ${req.params.id}`);
        res.json({ isDeleted: true });
    }).catch(err => {
        console.log(err);
        res.json({ isDeleted: false });
    });

};

module.exports = {
    getDestinations,
    postDestinationsNew,
    getDestination,
    getDestinationEdit,
    updateDestination,
    deleteDestination,
    getDestinationsNew
};