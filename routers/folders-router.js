var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

var Folders = require('../models/folders');
var mongoose = require('mongoose');

router.use(auth);

// Obtener folders del usuario
router.get('/', (req, res) => {
    console.log(req.user);
    Folders.find({ ownerId: mongoose.Types.ObjectId(req.user), parentFolder: null, deleted: false })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener datos de un folder específico
router.get('/:idFolder/detail', (req, res) => {
    Folders.aggregate([{
                $lookup: {
                    from: "Folders",
                    localField: "_id",
                    foreignField: "parentFolder",
                    as: "folders"
                }
            },
            {
                $lookup: {
                    from: "Projects",
                    localField: "_id",
                    foreignField: "folderId",
                    as: "projects"
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idFolder)
                }
            }
        ]).then(data => {

            data[0].projects = data[0].projects.filter(project => project.deleted == false);
            data[0].folders = data[0].folders.filter(folder => folder.deleted == false);

            console.log(data[0]);
            res.send(data[0]);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener folders destacados del usuario
router.get('/starred', (req, res) => {
    Folders.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true, deleted: false })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener folders en papelera del usuario
router.get('/deleted', (req, res) => {
    Folders.find({ ownerId: mongoose.Types.ObjectId(req.user), deleted: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener folders compartidos con el usuario
router.get('/shared', (req, res) => {

    Folders.aggregate([{
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
                    created: true,
                    lastModified: true,
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

// Crear un nuevo folder
router.post('/', (req, res) => {
    var newFolder = new Folders(req.body);
    newFolder.ownerId = mongoose.Types.ObjectId(req.user);
    newFolder.parentFolder = req.body.parentFolder || null;

    newFolder.save()
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Compartir un folder
router.put('/:idFolder/share', (req, res) => {

    Folders.findByIdAndUpdate(req.params.idFolder, { $push: { sharedWith: { _id: mongoose.Types.ObjectId(req.body.sharedWith) } } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Actualizar un folder
router.put('/:idFolder', (req, res) => {
    console.log("Entró a actualizar folder");
    const lastModified = Date.now();
    const { name } = req.body;
    Folders.findByIdAndUpdate(req.params.idFolder, { $set: { name, lastModified } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Destacar o quitar destacado de un folder
router.put('/:idFolder/stare', (req, res) => {
    Folders.findByIdAndUpdate(req.params.idFolder, { $set: { starred: req.body.starred } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Agregar o quitar un folder de la papelera
router.put('/:idFolder/trash', (req, res) => {
    Folders.findByIdAndUpdate(req.params.idFolder, { $set: { deleted: req.body.deleted, deletedOn: req.body.deleted ? new Date() : '' } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar permanentemente un folder
router.delete('/:idFolder', (req, res) => {
    Folders.remove({ _id: mongoose.Types.ObjectId(req.params.idFolder) })
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