var express = require('express');
var router = express.Router();

var fs = require('fs');


var auth = require('../middlewares/auth');

var Projects = require('../models/projects');
var mongoose = require('mongoose');

// Obtener proyectos de un usuario
router.get('/', auth, (req, res) => {
    Projects.find({ ownerId: mongoose.Types.ObjectId(req.user) })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener proyectos destacados del usuario
router.get('/starred', auth, (req, res) => {
    Projects.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener proyectos en papelera del usuario
router.get('/deleted', auth, (req, res) => {
    Projects.find({ ownerId: mongoose.Types.ObjectId(req.user), deleted: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener proyectos compartidos con el usuario
router.get('/shared', auth, (req, res) => {
    Projects.find({ sharedWith: mongoose.Types.ObjectId(req.user) })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener datos de un proyecto específico
router.get('/:idProyecto', auth, (req, res) => {
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
router.post('/', auth, (req, res) => {
    var newProject = new Projects(req.body);
    newProject.ownerId = mongoose.Types.ObjectId(req.user);
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
router.put('/:idProyecto', auth, (req, res) => {
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

// Destacar un proyecto
router.put('/:idProyecto/stare', auth, (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, { $set: { starred: true } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Enviar un proyecto a papelera
router.put('/:idProyecto/trash', auth, (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, { $set: { deleted: true } }, { new: true })
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
router.delete('/:idProyecto', auth, (req, res) => {
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