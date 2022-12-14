const db = require('../models');

async function initialize() {
    // Setup relationships
    db['user'].hasMany(db['destination'], { foreignKey: 'user_id'});
    db['destination'].belongsTo(db['user'], { foreignKey: 'user_id'});

    db['user'].hasMany(db['vote'], { foreignKey: 'user_id', onDelete: 'CASCADE'});
    db['vote'].belongsTo(db['user'], { foreignKey: 'user_id'});

    db['destination'].hasMany(db['vote'], { foreignKey: 'destination_id', onDelete: 'CASCADE'});
    db['vote'].belongsTo(db['destination'], { foreignKey: 'destination_id'});

    db['user'].hasMany(db['group'], { foreignKey: 'admin_user_id', onDelete: 'CASCADE' });
    db['group'].belongsTo(db['user'], { foreignKey: 'admin_user_id' });

    db['group'].hasMany(db['group_member'], { foreignKey: 'group_id', onDelete: 'CASCADE' });
    db['group_member'].belongsTo(db['group'], { foreignKey: 'group_id' });

    db['group'].hasMany(db['destination'], { foreignKey: 'group_id', onDelete: 'CASCADE'});
    db['destination'].belongsTo(db['group'], { foreignKey: 'group_id'});
}

function sync(force = false) {
    db.sequelize.sync({ force: force })
        .then(res => res)
        .then(() => console.log('Models synced with database'))
        .catch(err => console.error(err));
}

module.exports = {
    initialize,
    sync
};