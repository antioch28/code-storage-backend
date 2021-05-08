var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
const imageUploader = require('../middlewares/images')

var Users = require('../models/users');
var mongoose = require('mongoose');
const Plans = require('../models/plans');

// Obtener datos del usuario actual
router.get('/', auth, (req, res) => {

    Users.findById(req.user, { _id: true, name: true, email: true, profile: true, plan: true, settings: true, paymentMethod: true }).populate('plan.planInfo', { name: true, price: true, projects: true, snippets: true })
        .then(data => {
            res.send(data);
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

// Actualizar foto de perfil
router.post('/profile-pic', auth, imageUploader.upload.single('profile'), (req, res) => {
    console.log(req.file);
    if (req.file) {
        Users.findByIdAndUpdate(req.user, { profile: req.file.filename }, { omitUndefined: true, new: true })
            .then(data => {
                res.send(data);
                res.end();
            })
            .catch(err => {
                res.send(err);
                res.end();
            });
    } else {
        res.json({ ok: false, msg: "No se ha podido actualizar la foto de perfil" });
    }
});

// Obtener foto de perfil
router.get('/profile-pic', auth, (req, res) => {

    Users.findById(req.user, { profile: true })
        .then(data => {

            var profilePic = './src/public/uploads/' + data.profile;

            fs.stat(profilePic, (err) => {
                if (!err) {
                    res.sendFile(path.resolve(profilePic));
                    res.end();
                } else {
                    res.json({
                        ok: false,
                        msg: "No se encontró la imagen"
                    });
                    res.end();
                }
            })
        })
        .catch(err => {
            res.send(err);
            res.end();
        });

});

// Actualizar un usuario
router.put('/:idUsuario', auth, (req, res) => {
    Users.findByIdAndUpdate(req.params.idUsuario, req.body, { new: true, omitUndefined: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Establecer plan del usuario
router.put('/buy/:idPlan', (req, res) => {
    const { billingPeriod } = req.body;
    const now = Date.now();
    let endDate = 0;

    if (billingPeriod === 'year') {
        endDate = now + (365 * 24 * 60 * 60 * 1000);
    } else {
        endDate = now + (31 * 24 * 60 * 60 * 1000);
    }

    Usuarios.findByIdAndUpdate(req.user, { $set: { planInfo: mongoose.Types.ObjectId(req.params.idPlan), startDate: now, endDate } }, { new: true })
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

// Verificar si se ha registrado usuario (para funcionalidad de compartir)
router.get('/verifyIfSignedIn/:email', auth, (req, res) => {
    Users.findOne({ email: req.params.email })
        .then(data => {
            if (data) {
                res.json({ ok: true, _id: data._id });
                res.end();
            } else {
                res.json({ ok: false, msg: 'Usuario no encontrado', email: req.params.email });
                res.end();
            }
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

module.exports = router;