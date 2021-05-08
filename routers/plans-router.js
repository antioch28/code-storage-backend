var express = require('express');
var router = express.Router();

var Plans = require('../models/plans');
var mongoose = require('mongoose');

// Obtener planes
router.get('/', (req, res) => {
    Plans.find({}).sort({ price: 'ascending' })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener datos de un plan específico
router.get('/:idPlan', (req, res) => {
    Plans.findById(req.params.idPlan)
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Agregar un plan
router.post('/', (req, res) => {
    var newPlan = new Plans(req.body);
    newPlan.save()
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Actualizar un plan
router.put('/:idPlan', (req, res) => {
    const { name, price, projects, snippets } = req.body;
    Plans.findByIdAndUpdate(req.params.idPlan, { $set: { name, price, projects, snippets } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar un plan
router.delete('/:idPlan', (req, res) => {
    Plans.findByIdAndDelete(req.params.idPlan)
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