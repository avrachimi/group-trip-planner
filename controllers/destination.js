const db = require('../models');
const Destination = db['destination'];
const User = db['user'];

// GET /destinations
// Auth: User
const getDestinations = async (req, res, next) => {
    const destinations = await Destination.findAll();
    res.render('destinations', { destinations : destinations});
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
    if (!user) res.redirect('/login');

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
        res.json({ message: "Something went wrong." }); // FIXME: has to give user an error on the frontend
    });
};

// GET /destinations/:id
// Auth: User
const getDestination = async (req, res, next) => {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) res.redirect('/destinations');

    res.render('destination_view', { destination : destination });
};

// GET /destinations/:id/edit
// Auth: User
const getDestinationEdit = async (req, res, next) => {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) res.redirect('/destinations');

    res.render('destination_edit', { destination : destination });
};

// PUT /destinations/:id/edit
// Auth: User
const updateDestination = async (req, res, next) => {
    // TODO: Make sure that signed in user can only update destinations they created, unless signed in user is admin

    Destination.update({
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        budget: req.body.budget,
        nights_stay: req.body.nights_stay,
        vote_count: vote_count
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Destination (id:${req.params.id}) has been updated succesfully`);
        res.redirect(`/destinations/${req.params.id}`);
    }).catch(err => {
        console.log(err);
        res.redirect(`/destinations/${req.params.id}/edit`);
    });
};

// DELETE /destinations/:id
// Auth: User
const deleteDestination = (req, res, next) => {
    // TODO: Make sure that signed in user can only delete destinations they created, unless signed in user is admin
    Destination.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Deleted destination with Id ${req.params.id}`);
        res.redirect('/destinations');
    }).catch(err => {
        console.log(err);
        res.redirect(`/destinations/${req.params.id}`);
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