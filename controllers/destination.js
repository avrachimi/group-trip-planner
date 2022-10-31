const db = require('../models');
const Destination = db['destination'];
const User = db['user'];

// GET /destinations
const getAll = async (req, res, next) => {
    const destinations = await Destination.findAll();
    res.json(destinations);
};

// POST /destinations
const createOne = async (req, res, next) => {

    //TODO: Check if user is authenticated and use the proper user_id
    const user_id = 1;

    const user = await User.findByPk(user_id);
    if (!user) res.json({ message: `User with id ${user_id} was not found. Destination will not be created` });

    Destination.create({
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        budget: req.body.budget,
        nights_stay: req.body.nights_stay,
        user_id: user.id
    }).then(json => {
        res.json(json);
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong." });
    });
};

// GET /destinations/:id
const getOne = async (req, res, next) => {
    const destination = await Destination.findByPk(req.params.id);

    if (destination) res.json(destination);
    res.json({ message: "Destination not found" });
};

// PUT /destinations/:id
const updateOne = async (req, res, next) => {
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
        res.json({ message: `Destination (id:${req.params.id}) has been updated succesfully` });
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong with destination update" });
    });
};

// DELETE /destinations/:id
const deleteOne = (req, res, next) => {
    // TODO: Make sure that signed in user can only delete destinations they created, unless signed in user is admin
    Destination.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Deleted destination with Id ${req.params.id}`);
        res.json({ message: `Deleted destination with Id ${req.params.id}` });
    }).catch(err => {
        console.log(err);
        res.json({ message: `Could not delete destination with Id ${req.params.id}. Something went wrong` });
    });

};

module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
};