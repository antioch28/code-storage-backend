var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var tokenService = require('../services/token-service');

var User = require('../models/users');
var Plan = require('../models/plans');
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

                    data.populate('plan.planInfo', { name: true, price: true, projects: true, snippets: true }, (err, user) => {

                        if (err) {
                            res.send(err)
                            res.end();
                        } else {
                            data.password = '***';

                            return res.status(200).send({
                                ok: true,
                                token: tokenService.createToken(data._id),
                                data: user
                            });
                        }
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
    console.log("SIGNIN: ", req.body);
    var { name, email, password, passwordConfirm } = req.body;

    if (name != null && email != null && password != null && password == passwordConfirm) {

        User.findOne({ email: email })
            .then(async(data) => {

                if (data) {
                    res.json({ ok: false, msg: 'Ya se ha registrado una cuenta con este correo' });
                    return;
                }

                password = bcrypt.hashSync(password, 10);

                const planId = await getDefaultPlan();
                console.log("Plan por defetco: ", planId);

                const plan = {
                    planInfo: mongoose.Types.ObjectId(planId._id),
                    startDate: Date.now()
                };

                const newUser = new User({ name, email, password, plan });
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

function getDefaultPlan() {
    return Plan.findOne({ name: 'FREE' }, { _id: true }).exec();
}

module.exports = router;