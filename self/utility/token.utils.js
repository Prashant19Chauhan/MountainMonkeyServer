import jwt from "jsonwebtoken"

const generateToken = (payload, expiry) => {
    console.log("i am in token.js")
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: expiry })
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

const generateRefreshToken = (payload, expiry) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: expiry })
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

export { generateToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken }