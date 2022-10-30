module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('vote', {
        choice: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        freezeTableName: true, // Keep table name same as model name
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Vote;
};