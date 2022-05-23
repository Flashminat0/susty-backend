const db = require('../config/db.config');
const {Orders, Product, OtpNumber, Refunds, User, Wallet} = db


export const getOrderSummery = (req, res) => {
    const {userId} = req.body;

    let orderSummery = {
        onProcess: 0,
        onDelivery: 0,
        Delivered: 0,
    }

    Orders.findAll({
        where: {
            sellerId: userId,
        },
    }).then(orders => {
        orders.forEach(order => {
            if (order.status === 'On Process') {
                orderSummery.onProcess += 1
            } else if (order.status === 'On Delivery') {
                orderSummery.onDelivery += 1
            } else if (order.status === 'Delivered') {
                orderSummery.Delivered += 1
            }
        })
        return res.status(200).json(orderSummery)
    })
}

export const getProductSummery = (req, res) => {
    const {userId} = req.body;

    let productSummery = {
        published: 0,
        unpublished: 0,
    }

    Product.findAll({
        where: {
            sellerId: userId,
        },
    }).then(products => {
        products.forEach(product => {
            if (product.isPublished === true) {
                productSummery.published += 1
            } else if (product.isPublished === false) {
                productSummery.unpublished += 1
            }
        })
        return res.status(200).json(productSummery)
    })

}

export const getCustomerInsight = (req, res) => {
    const {userId} = req.body;

    //TODO ask about this
    let customerInsight = {
        newCustomer: 0,
        oldCustomer: 0,
    }

    let totalCustomer = 0;
    let newCustomers = 0;

    Orders.findAll({
        where: {
            sellerId: userId,
        },
    }).then(orders => {
        orders.forEach(order => {
            totalCustomer += 1;
            if (order.status === 'On Process') {
                newCustomers += 1;
            }
        })
        customerInsight.newCustomer = newCustomers;
        customerInsight.oldCustomer = totalCustomer - newCustomers;
        return res.status(200).json(customerInsight)
    })

}

export const getRefundStatus = (req, res) => {
    const {userId} = req.body;

    let refundSummery = {
        pending: 0,
        accepted: 0,
        declined: 0,
    }

    Refunds.findAll({
        where: {
            sellerId: userId,
        },
    }).then(refunds => {
        refunds.forEach(refund => {
            if (refund.status === 'Pending') {
                refundSummery.pending += 1
            } else if (refund.status === 'Accepted') {
                refundSummery.accepted += 1
            } else if (refund.status === 'Declined') {
                refundSummery.declined += 1
            }
        })
        res.status(200).json(refundSummery)
    })

}

export const getWalletDetails = (req, res) => {
    const {userId} = req.body;


    let walletSummery = {
        totalEarnings: 0,
        totalWithdraw: 0,
        balance: 0,
    }

    Wallet.findOne({
        where: {
            userId: userId,
        },
    }).then(wallet => {
        if (wallet) {
            walletSummery.totalEarnings = wallet.totalEarnings;
            walletSummery.totalWithdraw = wallet.totalWithdraw;
            walletSummery.balance = wallet.balance;
        }

        res.status(200).json(walletSummery)
    })

}