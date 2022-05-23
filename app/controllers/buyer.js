const db = require('../config/db.config')
const {Orders} = db

export const fetchOrdersByCustomer = (req, res) => {
    const {userId} = req.body

    Orders.findAll({
        where: {
            buyerId: userId,
        },
    })
        .then((orders) => {
            res.status(200).json({
                status: 'success',
                data: orders,
            })
        })
        .catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err.message,
            })
        })
}

export const SearchOrder = (req, res) => {
    const {userId, orderId} = req.body

    Orders.findOne({
        where: {
            buyerId: userId,
            orderId: orderId,
        },
    })
        .then((orders) => {
            res.status(200).json({
                status: 'success',
                data: orders,
            })
        })
        .catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err.message,
            })
        })
}

export const cancelOrder = (req, res) => {}
