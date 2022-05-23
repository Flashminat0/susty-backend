require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.database,
    process.env.user,
    process.env.password,
    {
        host: process.env.host,
        dialect: process.env.dialect,
        operatorsAliases: false,
        port: process.env.db_port,
        pool: {
            max: parseInt(process.env.max),
            min: parseInt(process.env.min),
            acquire: parseInt(process.env.acquire),
            idle: parseInt(process.env.idle),
        },
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Orders = require('../models/orders.model.js')(sequelize, Sequelize)
db.OtpNumber = require('../models/otpnumbers.model.js')(sequelize, Sequelize)
db.Product = require('../models/product.model.js')(sequelize, Sequelize)
db.Refunds = require('../models/refunds.model.js')(sequelize, Sequelize)
db.User = require('../models/user.model.js')(sequelize, Sequelize)
db.Wallet = require('../models/wallet.model.js')(sequelize, Sequelize)
db.Seller = require('../models/seller.model.js')(sequelize, Sequelize)
db.Customer = require('../models/customers.model.js')(sequelize, Sequelize)
db.Favourites = require('../models/favourites.model.js')(sequelize, Sequelize)
db.Site = require('../models/site.model.js')(sequelize, Sequelize)

module.exports = db
