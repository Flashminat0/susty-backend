module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('products', {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        sellerId: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        long_description: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        purchase_note: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        category: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        mainProductCategory: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        brand: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        refundable: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        usability: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        images: {
            type: Sequelize.JSON
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        isPublished: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        color: {
            type: Sequelize.JSON,
            allowNull: false
        },
        size: {
            type: Sequelize.JSON,
            allowNull: false
        },
        purchaseTags: {
            type: Sequelize.STRING(255),
        },
        shippingMethod: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        shippingMethodObj: {
            type: Sequelize.JSON
        },
    }, {
        timestamps: true
    });

    return Product;
}
