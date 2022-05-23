import db from '../config/db.config'
import moment from 'moment'
import jwt from 'jsonwebtoken'

const {customAlphabet} = require('nanoid')
const {User, Orders, Product, OtpNumber, Wallet, Refunds, Seller, Site} = db

require('dotenv').config()

export const register = (req, res) => {
    const {
        username,
        email,
        password,
        rePassword,
        phoneNumber,
        otpPin,
        region,
        firstName,
        lastName,
    } = req.body
    const userObj = {
        username,
        email,
        password,
        rePassword,
        phoneNumber,
        otpPin,
        region,
        firstName,
        lastName,
    }

    for (const userObjKey in userObj) {
        if (!userObj[userObjKey]) {
            return res.status(400).json({
                success: false,
                message: `${userObjKey} is required`,
            })
        }
    }

    if (
        !username ||
        !email ||
        !password ||
        !phoneNumber ||
        !otpPin ||
        !region ||
        !firstName ||
        !lastName ||
        !rePassword
    ) {
        return res.status(400).json({msg: `Please enter all fields`})
    } else if (password.length < 6 || rePassword.length < 6) {
        return res
            .status(400)
            .json({msg: 'Password must be at least 6 characters'})
    } else if (!passwordStrength(password)) {
        return res.status(400).json({msg: 'Passwords is not strong enough'})
    } else if (password !== rePassword) {
        return res.status(400).json({msg: 'Passwords do not match'})
    } else {
        User.findOne({
            where: {
                username: username,
            },
        }).then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({msg: 'Username already exists'})
            }

            User.findOne({
                where: {
                    email: email,
                },
            }).then((existingEmail) => {
                if (existingEmail) {
                    return res.status(400).json({msg: 'Email already used.'})
                }

                OtpNumber.findOne({
                    where: {
                        otp: otpPin,
                        phoneNumber: phoneNumber,
                    },
                }).then((otp) => {
                    if (!otp) {
                        return res.status(400).json({msg: 'OTP is not valid'})
                    }

                    OtpNumber.destroy({
                        where: {
                            otp: otpPin,
                            phoneNumber: phoneNumber,
                        },
                    })

                        //TODO IDEA otp expire time
                        // let otpExpired = moment().isAfter(otp.expired_at);

                        .then(() => {
                            User.create({
                                username: username,
                                email: email,
                                password: passwordHash(password),
                                phoneNumber: phoneNumber,
                                role: ['1', 'user'],
                                region: region,
                                firstName: firstName,
                                lastName: lastName,
                            })
                                .then((user) => {
                                    return res.status(200).json({
                                        msg: 'User created successfully',
                                    })
                                })
                                .catch((err) => {
                                    return res.status(400).json({
                                        msg: 'Something went wrong',
                                        err,
                                    })
                                })
                        })
                })
            })
        })
    }
}

//TODO implement password hashing algorithm
const passwordHash = (plainTextMessage) => {
    return plainTextMessage
}

const passwordStrength = (plainTextPassword) => {
    let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    return regex.test(plainTextPassword)
}

let refreshTokens = []

export const login = (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({msg: 'Please enter all fields'})
    } else if (password.length < 6) {
        return res
            .status(400)
            .json({msg: 'Password must be at least 6 characters'})
    } else {
        User.findOne({
            where: {
                username: username,
                password: passwordHash(password),
            },
        })
            .then((user) => {
                if (!user) {
                    return res
                        .status(400)
                        .json({msg: 'Username or password is incorrect'})
                } else {
                    const authToken = jwt.sign(
                        {
                            id: user.id,
                            role: user.role,
                        },
                        process.env.AUTH_TOKEN_SECRET
                    )
                    const refreshToken = jwt.sign(
                        {
                            id: user.id,
                            role: user.role,
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: '1h'}
                    )

                    //TODO
                    refreshTokens.push(refreshToken)

                    // res.cookie("token", token, {
                    //     httpOnly: true,
                    //     // secure: true, // only works on https
                    // });

                    return res.status(200).json({
                        msg: 'Login successful',
                        authToken,
                        refreshToken,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            phoneNumber: user.phoneNumber,
                            region: user.region,
                            firstName: user.firstName,
                            lastName: user.lastName,
                        },
                    })
                }
            })
            .catch((err) => {
                return res.status(400).json({msg: 'Something went wrong', err})
            })
    }
}

export const generateNewToken = (req, res) => {
    const {refreshToken, userDetails} = req.body

    if (refreshToken == null) {
        return res.sendStatus(401)
    }
    //todo discuss
    if (!refreshTokens.includes(refreshToken)) {
        console.log('refresh token not found')
        return res.sendStatus(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const authToken = jwt.sign(user, process.env.AUTH_TOKEN_SECRET, {
            expiresIn: '7d',
        })
        res.json({authToken})
    })
}

export const getOtp = (req, res) => {
    const {userId, phoneNumber} = req.body

    if (!phoneNumber) {
        return res.status(400).json({msg: 'Please enter all fields'})
    } else if (phoneNumber.length < 10) {
        return res
            .status(400)
            .json({msg: 'Phone number must be at least 10 characters'})
    } else {
        let otp_Password = Math.floor(1000 + Math.random() * 9000)

        let otp = {
            userId: userId,
            phoneNumber: phoneNumber,
            otp: otp_Password,
        }

        OtpNumber.destroy({
            where: {
                userId: userId,
            },
        })
            .then(() => {
                OtpNumber.create(otp)
                    .then(() => {
                        return res.status(200).json({
                            message: 'OTP sent successfully',
                            otp: otp_Password, //TODO remove later for testing only
                        })
                    })
                    .catch((err) => {
                        return res
                            .status(400)
                            .json({message: 'Something went wrong', err})
                    })
            })
            .catch((err) => {
                return res.status(400).json({message: 'No user', err})
            })
    }
}

export const otpForRegistration = (req, res) => {
    const {phoneNumber} = req.body

    if (!phoneNumber) {
        return res.status(400).json({msg: 'Please enter all fields'})
    } else if (phoneNumber.length < 10) {
        return res
            .status(400)
            .json({msg: 'Phone number must be at least 10 characters'})
    } else {
        let otp_Password = Math.floor(1000 + Math.random() * 9000)

        let otp = {
            phoneNumber: phoneNumber,
            otp: otp_Password,
        }

        OtpNumber.create(otp)
            .then(() => {
                return res.status(200).json({
                    message: 'OTP sent successfully',
                    otp: otp_Password, //TODO remove later for testing only
                })
            })
            .catch((err) => {
                return res
                    .status(400)
                    .json({message: 'Something went wrong', err})
            })
    }
}

export const isUserAvailable = (req, res) => {
    const {userName} = req.body

    User.findOne({
        where: {
            username: userName,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(200).json({
                    isAvailable: true,
                    msg: 'UserName is available to use',
                })
            } else {
                return res.status(200).json({
                    isAvailable: false,
                    msg: 'UserName is not available to use',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({msg: err.message})
        })
}

export const fetchUser = (req, res) => {
    const {userName} = req.body

    User.findOne({
        where: {
            username: userName,
        },
    })
        .then((user) => {
            return res.status(200).json({user: user})
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}

export const changePassword = (req, res) => {
    const {userId, password} = req.body

    if (passwordStrength(req.body.password) === false) {
        return res.status(400).json({
            msg: 'Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter',
        })
    }

    User.update(
        {
            password: passwordHash(password),
        },
        {
            where: {
                id: userId,
            },
        }
    )
        .then((user) => {
            return res.status(200).json({user: user})
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}

export const changeMobileNumber = (req, res) => {
    const {userId, phoneNumber} = req.body

    User.update(
        {
            phoneNumber: phoneNumber,
        },
        {
            where: {
                id: userId,
            },
        }
    )
        .then((user) => {
            return res.status(200).json({user: user})
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}

export const cancelOnPendingOrderByCustomer = (req, res) => {
    const {userId, orderId} = req.body

    Orders.update(
        {
            orderStatus: 'cancelledbycustomer',
        },
        {
            where: {
                orderId: orderId,
                buyerId: userId,
                orderStatus: 'pending',
            },
        }
    )
        .then((result) => {
            Orders.findAll({
                where: {
                    buyerId: userId,
                },
            })
                .then((result) => {
                    return res.status(200).json(result)
                })
                .catch((err) => {
                    return res.status(500).json(err)
                })
        })
        .catch((err) => {
            return res.status(500).json(err)
        })
}

export const cancelOnProcessOrderByCustomer = (req, res) => {
    const {userId, orderId} = req.body

    Orders.update(
        {
            orderStatus: 'cancelledbycustomer',
        },
        {
            where: {
                orderId: orderId,
                buyerId: userId,
                orderStatus: 'onprocess',
            },
        }
    )
        .then((result) => {
            Orders.findAll({
                where: {
                    buyerId: userId,
                },
            })
                .then((result) => {
                    return res.status(200).json(result)
                })
                .catch((err) => {
                    return res.status(500).json(err)
                })
        })
        .catch((err) => {
            return res.status(500).json(err)
        })
}

export const fetchUserDetails = (req, res) => {
    const {userId} = req.body

    User.findOne({
        where: {
            id: userId,
        },
    })
        .then((user) => {
            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    region: user.region,
                    phoneNumber: user.phoneNumber,
                },
            })
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}

export const changeUserFullName = (req, res) => {
    const {userId, firstName, lastName} = req.body

    User.update(
        {
            firstName: firstName,
            lastName: lastName,
        },
        {
            where: {
                id: userId,
            },
            returning: true,
        }
    )
        .then((user) => {
            return res.status(200).json({user: user[1][0]})
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}

export const changeUserEmail = (req, res) => {
    const {userId, email, phoneNumber, otp} = req.body

    OtpNumber.findOne({
        where: {
            userId: userId,
            phoneNumber: phoneNumber,
            otp: otp,
        },
    })
        .then((otpResult) => {
            if (otpResult) {
                OtpNumber.destroy({
                    where: {
                        userId: userId,
                        phoneNumber: phoneNumber,
                        otp: otp,
                    },
                }).then(() => {
                    User.update(
                        {
                            email: email,
                        },
                        {
                            where: {
                                id: userId,
                            },
                            returning: true,
                        }
                    )
                        .then((user) => {
                            return res.status(200).json({user: user[1][0]})
                        })
                        .catch((error) => {
                            return res
                                .status(400)
                                .json({msg: 'Not a valid user'})
                        })
                })
            }
        })
        .catch((error) => {
            return res.status(400).json({msg: 'OTP is not valid'})
        })
}

export const becomeSeller = (req, res) => {
    const {userId, storeName, storeUserName} = req.body

    //TODO image should be uploaded here too

    Seller.findOne({
        where: {
            storeUserName: storeUserName,
        },
    })
        .then((seller) => {
            if (seller) {
                return res.status(200).json({isAvailable: false})
            } else {
                Seller.create({
                    storeName: storeName,
                    storeUserName: storeUserName,
                    userId: userId,
                })
                    .then((seller) => {
                        User.update(
                            {
                                role: ['user', 'seller'],
                            },
                            {
                                where: {
                                    id: userId,
                                },
                                returning: true,
                            }
                        )
                            .then((user) => {
                                return res.status(200).json({isAvailable: true})
                            })
                            .catch((error) => {
                                return res
                                    .status(400)
                                    .json({msg: 'Not a valid user'})
                            })
                    })
                    .catch((error) => {
                        return res.status(400).json({msg: 'Not a valid user'})
                    })
            }
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user', error: error})
        })
}

export const isSellerUserNameAvailable = (req, res) => {
    const {storeUserName} = req.body

    Seller.findOne({
        where: {
            storeUserName: storeUserName,
        },
    })
        .then((seller) => {
            if (seller) {
                return res.status(200).json({isAvailable: false})
            } else {
                return res.status(200).json({isAvailable: true})
            }
        })
        .catch((error) => {
            return res.status(400).json({msg: 'Not a valid user'})
        })
}
export const getUserNotice = (req, res) => {
    Site.findOne({
        where: {
            id: 1,
        },
    })
        .then((site) => {
            return res.status(200).json(site.customerNotice)
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            })
        })
}
