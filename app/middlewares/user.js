import jwt from 'jsonwebtoken'

require('dotenv').config()

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.AUTH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
    })

    req.body.authToken = token
    next()
}

export const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.AUTH_TOKEN_SECRET, {}, (err, user) => {
        req.body.userId = user.id
        req.body.role = user.role
    })
    next()
}
