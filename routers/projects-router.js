var express = require('express');
var router = express.Router();

var fs = require('fs');


var auth = require('../middlewares/auth');

var Projects = require('../models/projects');
var mongoose = require('mongoose');

// Obtener proyectos del usuario
router.get('/', auth, (req, res) => {
    Projects.find({ ownerId: mongoose.Types.ObjectId(req.user), folderId: null, deleted: false })
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
router.get('/:idProyecto/detail', auth, (req, res) => {
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

// Obtener proyectos destacados del usuario
router.get('/starred', auth, (req, res) => {
    Projects.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true, deleted: false })
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

    Projects.aggregate([{
                $lookup: {
                    from: "Users",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $project: {
                    _id: true,
                    name: true,
                    description: true,
                    created: true,
                    lastModified: true,
                    code: true,
                    "owner.name": true,
                    "owner.email": true,
                    "owner.profile": true,
                    "sharedWithMe": { $in: [{ _id: mongoose.Types.ObjectId(req.user) }, "$sharedWith"] }
                }
            },
            {
                $match: {
                    "sharedWithMe": true
                }
            }
        ]).then(data => {
            data.map(el => el.owner = el.owner[0]);
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

// Compartir un proyecto
router.put('/:idProyecto/share', auth, (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, { $push: { sharedWith: { _id: mongoose.Types.ObjectId(req.body.sharedWith) } } }, { new: true })
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
    const lastModified = Date.now();
    const { name, description, code } = req.body;
    Projects.findByIdAndUpdate(req.params.idProyecto, { $set: { name, description, lastModified, code } }, { new: true, omitUndefined: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Destacar o quitar destacado un proyecto
router.put('/:idProyecto/stare', auth, (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, { $set: { starred: req.body.starred } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Agregar o quitar un proyecto de la papelera
router.put('/:idProyecto/trash', auth, (req, res) => {
    Projects.findByIdAndUpdate(req.params.idProyecto, { $set: { deleted: req.body.deleted, deletedOn: req.body.deleted ? Date.now() : null } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar permanentemente un proyecto
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