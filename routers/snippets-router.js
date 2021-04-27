var express = require('express');
var router = express.Router();

var Snippets = require('../models/snippets');
var mongoose = require('mongoose');

// Obtener datos de un snippet específico
router.get('/:idSnippet', (req, res) => {
    Snippets.findById(req.params.idSnippet)
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Crear un nuevo snippet
router.post('/', (req, res) => {
    var newProject = new Snippets(req.body);
    newProject.save()
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Actualizar un snippet
router.put('/:idSnippet', (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, req.body, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar un snippet
router.delete('/:idSnippet', (req, res) => {
    Snippets.remove({ _id: mongoose.Types.ObjectId(req.params.idSnippet) })
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