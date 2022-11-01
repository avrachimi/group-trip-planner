const db = require('../models');
const Vote = db['vote'];
const Destination = db['destination'];

// GET /votes
const getVotes = async (req, res, next) => {
    const votes = await Vote.findAll();
    
    res.render('votes', { votes:  votes });
};

// POST /votes
const postVotes = async (req, res, next) => {
    //TODO: Check if user is authenticated and use the proper user_id
    const user_id = 1;

    const destination = await Destination.findByPk(req.body.destination_id);
    if (!destination) res.json({ message: `Destination with id ${req.body.destination_id} does not exist, so vote is invalid.` });

    Vote.create({
        choice: req.body.choice,
        user_id: user_id,
        destination_id: req.body.destination_id
    }).then(json => {
        // Update vote_count field on Destination row    
        if (req.body.choice) {
            destination.vote_count++;
            destination.save();
        }
        res.json(json);
    }).catch(err => {
        console.log(err);
        res.json({ message: "Something went wrong." });
    });
};

// GET /votes/:id
const getVote = async (req, res, next) => {
    const vote = await Vote.findByPk(req.params.id);

    if (vote) res.json(vote);
    res.json({ message: "Vote not found" });
};

// PUT /votes/:id
const updateVote = async (req, res, next) => {
    // TODO: Make sure that signed in user can only update votes they created, unless signed in user is admin

    const vote = await Vote.findByPk(req.params.id, { include: Destination });
    if (!vote) res.json({ message: `Vote with id ${req.params.id} does not exist. Stopping update...` });

    Vote.update({
        choice: req.body.choice
    },
        {
            where: {
                id: req.params.id
            }
        }).then(() => {
            // Update vote_count field on Destination row
            if (req.body.choice) vote.destination.vote_count++;
            else vote.destination.vote_count--;
            vote.destination.save();

            console.log(`Vote (id:${req.params.id}) has been updated succesfully`);
            res.json({ message: `Vote (id:${req.params.id}) has been updated succesfully` });
        }).catch(err => {
            console.log(err);
            res.json({ message: "Something went wrong with Vote update" });
        });
};

// DELETE /votes/:id
const deleteVote = (req, res, next) => {
    // TODO: Make sure that signed in user can only delete votes they created, unless signed in user is admin
    Vote.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log(`Deleted Vote with Id ${req.params.id}`);
        res.json({ message: `Deleted Vote with Id ${req.params.id}` });
    }).catch(err => {
        console.log(err);
        res.json({ message: `Could not delete Vote with Id ${req.params.id}. Something went wrong` });
    });

};

module.exports = {
    getVotes,
    postVotes,
    getVote,
    updateVote,
    deleteVote
};