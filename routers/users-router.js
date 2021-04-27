var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var mongoose = require('mongoose');

// Obtener usuarios
router.get('/', (req, res) => {
    Users.find({})
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener datos de un usuario específico
router.get('/:idUsuario', (req, res) => {
    console.log(req.params.idUsuario);
    Users.find({ _id: mongoose.Types.ObjectId(req.params.idUsuario) })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

module.exports = router;