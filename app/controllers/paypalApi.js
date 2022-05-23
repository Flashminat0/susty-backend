const db = require('../config/db.config')
const { Orders } = db

export const paypalBuy = async (req, res) => {
    const { userId, product, paypal } = req.body

    console.log(paypal)

    await Orders.create({
        order_desc: product.long_description,
        productId: product.id,
        product: product.name,
        order_price: product.price,
        amount: 1,
        paymentStatus: 'Paid',
        orderStatus: 'Pending',
        sellerId: product.sellerId,
        buyerId: userId,
        purchaseDate: new Date(),
        // paypal: paypal
    })
        .then(() => {
            res.status(200).json({
                message: 'Order created successfully',
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error occured',
                error: err,
            })
        })

    console.log(req.body)
}

export const paypalBuyFail = async (req, res) => {
    const { userId, product, paypal } = req.body

    await Orders.create({
        order_desc: product.long_description,
        productId: product.id,
        product: product.name,
        order_price: product.price,
        amount: 1,
        paymentStatus: 'UnPaid',
        orderStatus: 'Cancelled by Customer',
        sellerId: product.sellerId,
        buyerId: userId,
        purchaseDate: new Date(),
        // paypal: paypal
    })
        .then(() => {
            res.status(200).json({
                message: 'Order created successfully',
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error occured',
                error: err,
            })
        })

    console.log(req.body)
}

export const paypalBuyError = async (req, res) => {
    const { userId, product } = req.body

    await Orders.create({
        order_desc: product.long_description,
        productId: product.id,
        product: product.name,
        order_price: product.price,
        amount: 1,
        paymentStatus: 'UnPaid',
        orderStatus: 'Cancelled by Customer',
        sellerId: product.sellerId,
        buyerId: userId,
        purchaseDate: new Date(),
        // paypal: paypal
    })
        .then(() => {
            res.status(200).json({
                message: 'Order created successfully',
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error occured',
                error: err,
            })
        })

    console.log(req.body)
}
