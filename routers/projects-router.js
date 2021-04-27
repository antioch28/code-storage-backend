var express = require('express');
var router = express.Router();

var Projects = require('../models/projects');
var mongoose = require('mongoose');

// Obtener datos de un proyecto específico
router.get('/:idProyecto', (req, res) => {
    Projects.findById(req.params.idProyecto)
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});


// Crear un nuevo proyecto
router.post('/', (req, res) => {
    var newProject = new Projects(req.body);
    console.log(newProject);
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

// Actualizar un proyecto
router.put('/:idProyecto', (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, req.body, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar un proyecto
router.delete('/:idProyecto', (req, res) => {
    Projects.remove({ _id: mongoose.Types.ObjectId(req.params.idProyecto) })
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