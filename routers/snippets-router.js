var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

var Snippets = require('../models/snippets');
var mongoose = require('mongoose');

// Obtener snippets del usuario
router.get('/', auth, (req, res) => {
    Snippets.find({ ownerId: mongoose.Types.ObjectId(req.user), deleted: false })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener datos de un snippet específico
router.get('/:idSnippet/detail', auth, (req, res) => {
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

// Obtener snippets destacados del usuario
router.get('/starred', auth, (req, res) => {
    Snippets.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true, deleted: false })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener snippets en papelera del usuario
router.get('/deleted', auth, (req, res) => {
    console.log("Entró a snippets en papelera: ", req.user);
    Snippets.find({ ownerId: mongoose.Types.ObjectId(req.user), deleted: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Obtener snippets compartidos con el usuario
router.get('/shared', auth, (req, res) => {

    Snippets.aggregate([{
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
                    language: true,
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
        ])
        .then(data => {
            data.map(el => el.owner = el.owner[0]);
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Crear un nuevo snippet
router.post('/', auth, (req, res) => {
    var newSnippet = new Snippets(req.body);
    newSnippet.ownerId = mongoose.Types.ObjectId(req.user);
    newSnippet.save()
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
router.put('/:idSnippet', auth, (req, res) => {
    const lastModified = Date.now();
    const { name, description, code } = req.body;
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $set: { name, description, lastModified, code } }, { new: true, omitUndefined: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Compartir un snippet
router.put('/:idSnippet/share', auth, (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $push: { sharedWith: { _id: mongoose.Types.ObjectId(req.body.sharedWith) } } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Destacar o quitar destacado de un snippet
router.put('/:idSnippet/stare', auth, (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $set: { starred: req.body.starred } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Agregar o quitar un snippet de la papelera
router.put('/:idSnippet/trash', auth, (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $set: { deleted: req.body.deleted, deletedOn: req.body.deleted ? new Date() : '' } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Eliminar permanentemente un snippet
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