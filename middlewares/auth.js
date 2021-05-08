const tokenService = require('../services/token-service')

function isAuth(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).send({ verification: false, message: 'No tienes autorización: no se ha enviado encabezado de autorización' })
    }

    const token = req.headers.authorization.split(" ")[1]

    if (token == 'null' || token === undefined) {
        return res.status(401).send({ verification: false, message: 'No tienes autorización: token undefined.' })
    }

    const decoded = tokenService.decodeToken(token);

    if (decoded) {
        //console.log("Decoded: ", decoded);
        req.user = decoded._id;
        next();
    } else {
        res.status(401).send({ verification: false, msg: 'Token expirado' });
    }
}

module.exports = isAuth;