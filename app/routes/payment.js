import express from 'express'

import {validateToken} from '../middlewares/user'
import {
    paypalBuy,
    paypalBuyFail,
    paypalBuyError,
} from '../controllers/paypalApi'

const router = express.Router()

router.post('/product/buy', validateToken, paypalBuy)
router.post('/product/no-buy', validateToken, paypalBuyFail)
router.post('/product/err-buy', validateToken, paypalBuyError)

module.exports = router
