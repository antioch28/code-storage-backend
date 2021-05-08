const jwt = require('jsonwebtoken')
const config = require('./config')

function createToken(_id) {
    return jwt.sign({ _id: _id, iat: Date.now() }, config.SECRET_TOKEN, { expiresIn: 4 * 60 * 60 * 1000, issuer: "code-storage", noTimestamp: true });
}

function decodeToken(token) {
    return jwt.verify(token, config.SECRET_TOKEN);
}

module.exports = { createToken, decodeToken }