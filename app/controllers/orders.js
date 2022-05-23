import moment from 'moment'

const db = require('../config/db.config')
const { Op } = require('sequelize')
const { Orders } = db

export const listOrders = (req, res) => {
    const { userId } = req.body

    Orders.findAll({
        where: {
            sellerId: userId,
        },
    })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

export const listCustomerOrders = (req, res) => {
    const { userId } = req.body

    Orders.findAll({
        where: {
            buyerId: userId,
        },
        order: [['createdAt', 'DESC']],
    })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

export const searchOrder = (req, res) => {
    const { sellerId, orderId } = req.body

    Orders.findAll({
        where: {
            sellerID: sellerId,
            orderID: orderId,
        },
    })
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.json(err)
        })
}

export const viewOrder = (req, res) => {
    const { orderId } = req.body

    Orders.findOne({
        where: {
            orderID: orderId,
        },
    })
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.json(err)
        })
}

export const filterOrders = (req, res) => {
    const { userId } = req.body
    const filters = req.query

    if (filters.startDate || filters.endDate) {
        filters.createdAt = {
            [Op.between]: [
                req.query.startDate
                    ? new Date(moment(req.query.startDate).format('YYYY-MM-DD'))
                    : new Date(moment('1980-01-01').format('YYYY-MM-DD')),
                req.query.endDate
                    ? new Date(moment(req.query.endDate).format('YYYY-MM-DD'))
                    : new Date(moment('2050-01-01').format('YYYY-MM-DD')),
            ],
        }
        delete filters.startDate
        delete filters.endDate
    }

    if (filters.stockMin || filters.stockMax) {
        filters.amount = {
            [Op.between]: [
                filters.stockMin ? parseInt(filters.stockMin) : 0,
                filters.stockMax ? parseInt(filters.stockMax) : 99999,
            ],
        }
        delete filters.stockMin
        delete filters.stockMax
    }

    for (const queryKey in req.query) {
        if (
            filters[queryKey] === '' ||
            filters[queryKey] === null ||
            filters[queryKey] === undefined
        ) {
            delete filters[queryKey]
        }
    }

    Orders.findAll({
        where: {
            sellerId: userId,
            ...filters,
        },
        order: [['createdAt', 'DESC']],
    })
        .then((result) => {
            return res.status(200).json(result)
        })
        .catch((err) => {
            res.json(err)
        })

    // return res.status(200).json(req.params)
}

export const filterOrdersCustomer = (req, res) => {
    const { userId } = req.body
    const filters = req.query

    delete filters.page
    delete filters.pageSize

    for (const queryKey in req.query) {
        if (
            filters[queryKey] === '' ||
            filters[queryKey] === null ||
            filters[queryKey] === undefined
        ) {
            delete filters[queryKey]
        }
    }

    if (filters.orderId) {
        filters.orderId = req.query.orderId
    }

    if (filters.startDate && filters.endDate) {
        filters.purchaseDate = {
            [Op.between]: [
                req.query.startDate
                    ? new Date(moment(req.query.startDate).format('YYYY-MM-DD'))
                    : new Date(moment('1980-01-01').format('YYYY-MM-DD')),
                req.query.endDate
                    ? new Date(moment(req.query.endDate).format('YYYY-MM-DD'))
                    : new Date(moment('2050-01-01').format('YYYY-MM-DD')),
            ],
        }
        delete filters.startDate
        delete filters.endDate
    }

    if (filters.amountMax && filters.amountMin) {
        filters.amount = {
            [Op.between]: [
                req.query.amountMin ? req.query.amountMin : '0',
                req.query.amountMax ? req.query.amountMax : '99999',
            ],
        }
        delete filters.amountMax
        delete filters.amountMin
    }

    if (filters.orderStatus) {
        filters.orderStatus = {
            [Op.like]: req.query.orderStatus,
        }
    }

    if (filters.paymentStatus) {
        filters.paymentStatus = req.query.paymentStatus
    }

    Orders.findAll({
        where: {
            buyerId: userId,
            ...filters,
        },
        order: [['orderId', 'DESC']],
    })
        .then((result) => {
            return res.status(200).json(result)
        })
        .catch((err) => {
            res.json(err)
        })

    // return res.status(200).json(req.params)
}

export const cancelPendingOrderBySeller = (req, res) => {
    const { userId, orderId } = req.body

    Orders.update(
        {
            orderStatus: 'cancelledbyseller',
        },
        {
            where: {
                orderId: orderId,
                sellerId: userId,
                orderStatus: 'pending',
            },
        }
    )
        .then((result) => {
            Orders.findAll({
                where: {
                    sellerId: userId,
                },
            })
                .then((result) => {
                    return res.status(200).json(result)
                })
                .catch((err) => {
                    return res.status(500).json(err)
                })
        })
        .catch((err) => {
            return res.status(500).json(err)
        })
}

export const cancelOnProcessOrderBySeller = (req, res) => {
    const { userId, orderId } = req.body

    Orders.update(
        {
            orderStatus: 'cancelledbyseller',
        },
        {
            where: {
                orderId: orderId,
                sellerId: userId,
                orderStatus: 'onprocess',
            },
        }
    )
        .then((result) => {
            Orders.findAll({
                where: {
                    sellerId: userId,
                },
            })
                .then((result) => {
                    return res.status(200).json(result)
                })
                .catch((err) => {
                    return res.status(500).json(err)
                })
        })
        .catch((err) => {
            return res.status(500).json(err)
        })
}
