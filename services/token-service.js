const jwt = require('jsonwebtoken')
const config = require('./config')

function createToken(_id) {
    return jwt.sign({ _id }, config.SECRET_TOKEN, { expiresIn: "10h" });
}

function decodeToken(token) {
    return jwt.verify(token, config.SECRET_TOKEN);
}

module.exports = { createToken, decodeToken }