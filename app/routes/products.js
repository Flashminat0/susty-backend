import express from "express";

import {
    addImage,
    fetchSellerProductList,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    addProduct,
    updateProduct, filterProductsToUser
} from "../controllers/products";
import {validateToken} from "../middlewares/user";

const router = express.Router();


router.post("/product/add-image", addImage);
router.get('/product/get-all-seller', validateToken, fetchSellerProductList);
router.put("/product/publish-product", validateToken, publishProduct);
router.put("/product/unpublish-product", validateToken, unpublishProduct);
router.post("/product/delete-product", validateToken, deleteProduct);

router.get("/product/filter-user-products", filterProductsToUser);

router.post("/product/add-product", validateToken, addProduct);
router.put("/product/update-product", validateToken, updateProduct);
router.delete("/product/delete-product", validateToken, deleteProduct);

module.exports = router;
