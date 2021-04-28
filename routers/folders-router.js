var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

var Folders = require('../models/folders');
var mongoose = require('mongoose');

// Obtener folders del usuario
router.get('/', auth, (req, res) => {
    Folders.find({ ownerId: mongoose.Types.ObjectId(req.user) })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener folders destacados del usuario
router.get('/starred', auth, (req, res) => {
    Folders.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true })
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
router.get('/deleted', auth, (req, res) => {
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
router.get('/shared', auth, (req, res) => {
    Folders.find({ sharedWith: mongoose.Types.ObjectId(req.user) })
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
router.get('/:idFolder', auth, (req, res) => {
    Folders.findById(req.params.idFolder)
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Crear un nuevo folder
router.post('/', auth, (req, res) => {
    var newFolder = new Folders(req.body);
    newFolder.ownerId = mongoose.Types.ObjectId(req.user);
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

// Actualizar un folder
router.put('/:idFolder', auth, (req, res) => {
    Folders.findByIdAndUpdate(req.params.idFolder, req.body, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Destacar un folder
router.put('/:idFolder/stare', auth, (req, res) => {
    Folders.findByIdAndUpdate(req.params.idFolder, { $set: { starred: true } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Enviar un folder a papelera
router.put('/:idFolder/trash', auth, (req, res) => {
    Folders.findByIdAndUpdate(req.params.idFolder, { $set: { deleted: true } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar un folder
router.delete('/:idFolder', auth, (req, res) => {
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