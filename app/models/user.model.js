module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        username: {
            type: Sequelize.STRING(200),
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.STRING(200),
            allowNull: false,
            unique: true,
            isEmail: true,
        },
        password: {
            type: Sequelize.STRING(200),
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true,
        },
        role: {
            type: Sequelize.JSON,
            allowNull: false,
            unique: false,
            defaultValue: 'user',
        },
        firstName: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        region: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        billingAddress: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        shippingAddress: {
            type: Sequelize.JSON,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

    return User;
}
