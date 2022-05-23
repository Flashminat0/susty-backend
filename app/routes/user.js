import express from "express";
import {authenticateToken, validateToken} from "../middlewares/user";
import {
    fetchUser,
    generateNewToken,
    getOtp,
    isUserAvailable,
    login,
    register,
    cancelOnPendingOrderByCustomer,
    cancelOnProcessOrderByCustomer,
    changeMobileNumber,
    changePassword,
    fetchUserDetails,
    changeUserFullName,
    changeUserEmail,
    otpForRegistration, becomeSeller, isSellerUserNameAvailable , getUserNotice
} from "../controllers/user";
import {addFavourite, getAllFavourites, removeFavourite} from "../controllers/favourites";

const router = express.Router();

//authenticateToken is a middleware function

//get user details
router.get("/user/get-user-by-username", validateToken, fetchUser);
router.get("/user/get-user", validateToken, fetchUserDetails);

//user signup page
router.post("/user/login", login);
router.post("/user/register", register);
router.post("/user/get-otp", validateToken, getOtp)
router.post("/user/get-otp-registration", otpForRegistration)
router.get("/user/is-available", isUserAvailable)

router.put("/user/change-user-full-name", validateToken, changeUserFullName)
router.put("/user/change-user-email", validateToken, changeUserEmail)
router.put("/user/change-mobile-number", validateToken, changeMobileNumber)
router.put("/user/change-password", validateToken, changePassword)

router.put("/user/become-seller", validateToken, becomeSeller)
router.put("/user/is-seller-username-available", validateToken, isSellerUserNameAvailable)

router.get("/user/token", validateToken, generateNewToken)

router.put("/user/cancel-on-pending-order", validateToken, cancelOnPendingOrderByCustomer)
router.put("/user/cancel-on-process-order", validateToken, cancelOnProcessOrderByCustomer)


router.get("/user/fetch-favourites", validateToken ,getAllFavourites)
router.post("/user/add-favourites", validateToken ,addFavourite)
router.post("/user/remove-favourites", validateToken ,removeFavourite)

router.get("/user/get-notice", validateToken, getUserNotice)

module.exports = router;
