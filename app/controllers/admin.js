import {Op} from 'sequelize'
import moment from 'moment'

const db = require('../config/db.config')
const {User, Site, Product, Refunds, Orders} = db

export const setSellerNotice = (req, res) => {
    const {sellerNotice} = req.body

    Site.update(
        {
            sellerNotice: sellerNotice,
        },
        {
            where: {
                id: 1,
            },
        }
    ).then((sellerNotice) => {
        // return res.
        Site.findOne({
            where: {
                id: 1,
            },
        })
            .then((site) => {
                return res.status(200).json({
                    success: true,
                    message: 'Seller notice updated successfully',
                    sellerNotice: site.sellerNotice,
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    success: false,
                    message: 'Error updating seller notice',
                    error: err,
                })
            })
    })
}

export const setCustomerNotice = (req, res) => {
    const {customerNotice} = req.body

    Site.update(
        {
            customerNotice: customerNotice,
        },
        {
            where: {
                id: 1,
            },
        }
    ).then((customerNotice) => {
        // return res.
        Site.findOne({
            where: {
                id: 1,
            },
        })
            .then((site) => {
                return res.status(200).json({
                    success: true,
                    message: 'Seller notice updated successfully',
                    customerNotice: site.customerNotice,
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    success: false,
                    message: 'Error updating seller notice',
                    error: err,
                })
            })
    })
}

export const fetchNotices = (req, res) => {
    Site.findOne({
        where: {
            id: 1,
        },
    })
        .then((site) => {
            return res.status(200).json({
                success: true,
                message: 'Notices Fetched successfully',
                sellerNotice: site.sellerNotice,
                customerNotice: site.customerNotice,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: 'Notices could not be fetched',
                error: err,
            })
        })
}

export const fetchAllProducts = (req, res) => {
    Product.findAll({
        where: {
            isPublished: true,
        },
    })
        .then((products) => {
            return res.status(200).json({
                success: true,
                message: 'Products Fetched successfully',
                products: products,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: 'Products could not be fetched',
                error: err,
            })
        })
}

export const fetchAllUsers = (req, res) => {
    User.findAll({
        where: {
            role: 'user' || 'seller',
        },
    })
        .then((users) => {
            return res.status(200).json({
                success: true,
                message: 'Users Fetched successfully',
                users: users,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: 'Users could not be fetched',
                error: err,
            })
        })
}

export const fetchAllOrders = (req, res) => {
    Orders.findAll({})
        .then((orders) => {
            return res.status(200).json({
                success: true,
                message: 'Orders Fetched successfully',
                orders: orders,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: 'Orders could not be fetched',
                error: err,
            })
        })
}

export const fetchAllRefunds = (req, res) => {
    Refunds.findAll({})
        .then((orders) => {
            return res.status(200).json({
                success: true,
                message: 'Orders Fetched successfully',
                orders: orders,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: 'Orders could not be fetched',
                error: err,
            })
        })
}

export const filterCustomers = (req, res) => {
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

    if (filters.customerId) {
        filters.userId = req.query.customerId
        delete filters.customerId
    }

    if (filters.startDate && filters.endDate) {
        filters.updatedAt = {
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

    if (filters.OrdersMin && filters.OrdersMax) {
        filters.totalOrders = {
            [Op.between]: [
                req.query.OrdersMin ? req.query.OrdersMin : '0',
                req.query.OrdersMax ? req.query.OrdersMax : '99999',
            ],
        }
        delete filters.OrdersMin
        delete filters.OrdersMax
    }

    if (filters.moneyMin && filters.moneyMax) {
        filters.totalAmount = {
            [Op.between]: [
                req.query.moneyMin ? req.query.moneyMin : '0',
                req.query.moneyMax ? req.query.moneyMax : '99999',
            ],
        }
        delete filters.moneyMin
        delete filters.moneyMax
    }

    let Customer
    Customer.findAll({
        where: {
            ...filters,
        },
        order: [['userId', 'DESC']],
    })
        .then((customers) => {
            return res.status(200).json(customers)
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            })
        })
}

export const filterOrders = (req, res) => {
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

export const filterRefunds = (req, res) => {
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

    if (filters.refundId) {
        filters.refundId = req.query.refundId
    }

    if (filters.startDate && filters.endDate) {
        filters.requestedDate = {
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

    if (filters.refundType) {
        filters.refundType = {
            [Op.like]: req.query.refundType,
        }
    }

    if (filters.refundStatus) {
        filters.refundStatus = req.query.refundStatus
    }

    Refunds.findAll({
        where: {
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
}
