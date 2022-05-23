import express from "express";

const router = express.Router();

import {getAllProducts, getProductById} from "../controllers/products";


// dashboard
router.get("/guest/get-all-products", getAllProducts);
router.get("/guest/get-product-by-id", getProductById);



module.exports = router;