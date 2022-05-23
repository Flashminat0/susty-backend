import express from 'express'
import {
    changeDescription,
    changeLocation,
    filterProducts,
    getSellerNotice,
    removeStore,
    getStoreInfo,
    changeStoreDescription,
    getBankInfo,
    changeBankInfo,
} from '../controllers/seller'
import { validateToken } from '../middlewares/user'

const router = express.Router()

router.get('/seller/get-notice', validateToken, getSellerNotice)
router.post('/seller/change-description', changeDescription)
router.post('/seller/remove-store', validateToken, removeStore)
router.get('/seller/filter-products', validateToken, filterProducts)

router.get('/seller/get-store-info', validateToken, getStoreInfo)
router.put(
    '/seller/change-store-description',
    validateToken,
    changeStoreDescription
)
router.put('/seller/change-location', validateToken, changeLocation)
router.get('/seller/get-bank-info', validateToken, getBankInfo)
router.put('/seller/change-bank-info', validateToken, changeBankInfo)

module.exports = router
