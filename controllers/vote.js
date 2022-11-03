const db = require('../models');
const Vote = db['vote'];
const Destination = db['destination'];

// GET /votes
// Auth: User
const getVotes = async (req, res, next) => {
    const votes = await Vote.findAll();
    
    res.render('votes', { votes:  votes });
};

// POST /votes
// Auth: User
const postVotes = async (req, res, next) => {
    const user_id = req.session.user_id;
    const choice = req.body.choice;

    const destination = await Destination.findByPk(req.body.destination_id);
    if (!destination) return res.json({ destination: destination, isOwner: user_id === destination.user_id, message: "Could not find destination." });

    Vote.findOne({
        where: {
            user_id: user_id
        }
    }).then(vote => {
        if (vote) { // Update
            vote.update({ choice: choice });
            vote.save();
            return res.json({ destination: destination, isOwner: user_id === destination.user_id });
        }
        else { // Create
            Vote.create({
                choice: choice,
                user_id: user_id,
                destination_id: destination.id
            }).then(json => {
                // Update vote_count field on Destination row    
                if (choice) {
                    destination.vote_count++;
                }
                else {
                    destination.vote_count--;
                }
                destination.save();

                return res.json({ destination: destination, isOwner: user_id === destination.user_id });
            }).catch(err => {
                console.log(err);
                return res.json({ message: "Something went wrong." });
            });
        }
    }).catch(() => res.json({ message: "Something went wrong." }));

};

// GET /votes/:id
// Auth: User
const getVote = async (req, res, next) => {
    const vote = await Vote.findByPk(req.params.id);

    if (vote) res.json(vote);
    res.json({ message: "Vote not found" });
};

// PUT /votes/:id
// Auth: User
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
// Auth: User
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