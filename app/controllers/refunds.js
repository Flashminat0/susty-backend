import db from '../config/db.config'
import {Op} from 'sequelize'
import moment from 'moment'

const {Refunds, Product, User} = db

export const listRefunds = (req, res) => {
    const {userId} = req.body

    Refunds.findAll({
        where: {
            sellerId: userId,
        },
        order: [['updatedAt', 'ASC']],
    })
        .then((refunds) => {
            res.status(200).json(refunds)
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

export const searchRefund = (req, res) => {
    const {sellerId, orderId} = req.body

    Refunds.findOne({
        where: {
            sellerId: sellerId,
            orderId: orderId,
        },
    })
        .then((refund) => {
            res.status(200).json(refund)
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}
export const acceptRefund = (req, res) => {
    const {userId, refundId} = req.body

    Refunds.update(
        {
            refundStatus: 'Accepted',
        },
        {
            where: {
                refundId: refundId,
                sellerId: userId,
            },
        }
    ).then((refund) => {
        Refunds.findAll({
            where: {
                sellerId: userId,
            },
        })
            .then((refund) => {
                return res.status(200).json(refund)
            })
            .catch((err) => {
                return res.status(400).json(err)
            })
    })
}

export const declineRefund = (req, res) => {
    const {userId, refundId} = req.body

    Refunds.update(
        {
            refundStatus: 'Declined',
        },
        {
            where: {
                refundId: refundId,
                sellerId: userId,
            },
        }
    ).then((refund) => {
        Refunds.findAll({
            where: {
                sellerId: userId,
            },
        })
            .then((refund) => {
                return res.status(200).json(refund)
            })
            .catch((err) => {
                return res.status(400).json(err)
            })
    })
}

export const viewRefundDetails = (req, res) => {
    const {userId, orderId} = req.body

    Refunds.findOne({
        where: {
            sellerId: userId,
            orderId: orderId,
        },
    })
        .then((refund) => {
            res.status(200).json(refund)
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

export const filterRefunds = (req, res) => {
    const {userId} = req.body

    const filters = req.query

    console.log(filters)

    if (filters.startDate && filters.endDate) {
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

    if (filters.stockMax && filters.stockMin) {
        filters.amount = {
            [Op.between]: [
                req.query.stockMin ? req.query.stockMin : '0',
                req.query.stockMax ? req.query.stockMax : '99999',
            ],
        }
        delete filters.stockMax
        delete filters.stockMin
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

    Refunds.findAll({
        where: {
            sellerId: userId,
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

export const filterRefundsOnCustomer = (req, res) => {
    const {userId} = req.body

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

    if (filters.stockMax && filters.stockMin) {
        filters.amount = {
            [Op.between]: [
                req.query.stockMin ? req.query.stockMin : '0',
                req.query.stockMax ? req.query.stockMax : '99999',
            ],
        }
        delete filters.stockMax
        delete filters.stockMin
    }

    if (filters.paymentStatus) {
        filters.paymentStatus = {
            [Op.like]: req.query.paymentStatus,
        }
    }

    if (filters.orderStatus) {
        filters.orderStatus = req.query.orderStatus
    }

    Refunds.findAll({
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
}

export const fetchCustomerRefunds = (req, res) => {
    const {userId} = req.body

    Refunds.findAll({
        where: {
            buyerId: userId,
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

export const viewCustomerRefund = (req, res) => {
    const {userId, refundId} = req.body

    Refunds.findOne({
        where: {
            buyerId: userId,
            refundId: refundId,
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

export const searchCustomerRefund = (req, res) => {
    const {userId, refundId} = req.body

    const x = {}
    x.refundId = {
        [Op.like]: refundId,
    }

    Refunds.findOne({
        where: {
            buyerId: userId,
            ...x,
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
