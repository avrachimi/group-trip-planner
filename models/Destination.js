module.exports = (sequelize, DataTypes) => {
    const Destination = sequelize.define('destination', {
        description: {
            type: DataTypes.TEXT
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.city}, ${this.country}`;
            },
            set(value) {
                throw new Error('Do not try to set the `name` value!');
            }
        },
        budget: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nights_stay: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vote_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        freezeTableName: true, // Keep table name same as model name
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Destination;
};