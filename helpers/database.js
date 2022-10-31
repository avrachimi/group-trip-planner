const db = require('../models');

function initialize() {
    // Setup relationships
    // FIXME: Fix OnDelete and OnUpdate options
    db['user'].hasMany(db['destination'], { foreignKey: 'user_id'});
    db['destination'].belongsTo(db['user'], { foreignKey: 'user_id'});

    db['user'].hasMany(db['vote'], { foreignKey: 'user_id', onDelete: 'CASCADE'});
    db['vote'].belongsTo(db['user'], { foreignKey: 'user_id'});

    db['destination'].hasMany(db['vote'], { foreignKey: 'destination_id', onDelete: 'CASCADE'});
    db['vote'].belongsTo(db['destination'], { foreignKey: 'destination_id'});
}

function sync(force = false) {
    db.sequelize.sync({ force: force })
        .then(res => res)
        .then(() => {
            console.log('Models synced with database');
        })
        .catch(err => console.log(err));
}

module.exports = {
    initialize,
    sync
};