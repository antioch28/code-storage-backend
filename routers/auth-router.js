var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var tokenService = require('../services/token-service');

var User = require('../models/users');
var mongoose = require('mongoose');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log(req.body);

    if (email != "" && password != "") {
        User.findOne({ email: email })
            .then(data => {

                if (!data) {
                    res.json({ ok: false, msg: 'Credenciales incorrectas' });
                    return;
                }

                const passwordCheck = bcrypt.compareSync(password, data.password);

                if (passwordCheck) {
                    return res.status(200).send({
                        ok: true,
                        token: tokenService.createToken(data._id),
                        data: data
                    });
                } else {
                    res.json({ ok: false, msg: 'Credenciales incorrectas' });
                    return;
                }
            })
            .catch(err => {
                res.send(err);
                res.end();
            });
    } else {
        res.json({ ok: false, msg: 'Campos incompletos' });
    }
});

router.post('/signin', (req, res) => {
    var { name, email, password, passwordConfirm } = req.body;

    if (name != null && email != null && password != null && password == passwordConfirm) {

        User.findOne({ email: email })
            .then(data => {

                if (data) {
                    res.json({ ok: false, msg: 'Ya se ha registrado una cuenta con este correo' });
                    return;
                }

                password = bcrypt.hashSync(password, 10);

                const newUser = new User({ name, email, password });
                newUser.save()
                    .then(user => {
                        return res.status(200).send({
                            ok: true,
                            token: tokenService.createToken(user._id),
                            data: user
                        });
                    }).catch(err => {
                        res.send(err);
                        res.end();
                    });
            })
            .catch(err => {
                res.send(err);
                res.end();
            });

    } else {
        res.json({ ok: false, msg: 'Campos incompletos' });
    }
});

module.exports = router;