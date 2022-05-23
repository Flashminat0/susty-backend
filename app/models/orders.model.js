module.exports = (sequelize, Sequelize) => {
    const Orders = sequelize.define('orders', {
        orderId: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        order_desc: {
            //fixme needs to be changed to something ? IDK
            type: Sequelize.TEXT,
            allowNull: false,
        },
        product: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        order_price: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        paymentStatus:{
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'Pending',
        },
        orderStatus:{
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'Pending',
        },
        sellerId: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        buyerId: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        purchaseDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    }, {
        timestamps: true
    });

    return Orders;
};