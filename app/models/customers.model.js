module.exports = (sequelize, Sequelize) => {
    const Customers = sequelize.define('customers', {
        userId : {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        username: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        sellerId: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        totalOrders:{
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalAmount:{
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true
    });

    return Customers;
};