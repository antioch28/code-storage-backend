var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var mongoose = require('mongoose');

// Obtener usuarios
router.get('/', (req, res) => {
    Users.find({})
        .then(data => {
            console.log('data: ', data);
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

    Users.aggregate([{
                $lookup: {
                    from: "Projects",
                    localField: "projects._id",
                    foreignField: "_id",
                    as: "projects"
                }
            },
            {
                $lookup: {
                    from: "Snippets",
                    localField: "snippets._id",
                    foreignField: "_id",
                    as: "snippets"
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idUsuario)
                }
            }
        ]).then(data => {
            res.send(data[0]);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });

});

// Crear nuevo usuario
router.post('/', (req, res) => {
    console.log(req.body);
    Users.findOne({ email: req.body.email })
        .then(data => {
            if (!data) {
                var newUser = new Users(req.body);
                newUser.save((err, user) => {
                    if (err) {
                        res.send(err);
                        res.end();
                    } else {
                        res.send(user);
                        res.end();
                    }
                });
            } else {
                res.emit("error", new Error("Ya se ha registrado con este correo"));
                res.end();
            }
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Actualizar un usuario
router.put('/:idUsuario', (req, res) => {
    Users.findByIdAndUpdate(req.params.idUsuario, req.body, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar un usuario
router.delete('/:idUsuario', (req, res) => {
    Users.findByIdAndRemove(req.params.idUsuario)
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