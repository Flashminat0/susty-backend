import express from 'express'
import { getSellerCustomers, filterCustomers } from '../controllers/customers'
import { validateToken } from '../middlewares/user'

const router = express.Router()

router.get('/customers/get-seller-customers', validateToken, getSellerCustomers)
router.get('/customers/filter-customers', validateToken, filterCustomers)

module.exports = router
