var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

var Snippets = require('../models/snippets');
var mongoose = require('mongoose');

// Obtener snippets del usuario
router.get('/', auth, (req, res) => {
    Snippets.find({ ownerId: mongoose.Types.ObjectId(req.user) })
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
    Snippets.find({ ownerId: mongoose.Types.ObjectId(req.user), starred: true })
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
    Snippets.find({ sharedWith: mongoose.Types.ObjectId(req.user) })
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
router.get('/:idSnippet', auth, (req, res) => {
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

// Destacar un snippet
router.put('/:idSnippet/stare', auth, (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $set: { starred: true } }, { new: true })
        .then(data => {
            res.send(data);
            res.end();
        })
        .catch(err => {
            res.send(err);
            res.end();
        });
});

// Enviar un snippet a papelera
router.put('/:idSnippet/trash', auth, (req, res) => {
    Snippets.findByIdAndUpdate(req.params.idSnippet, { $set: { deleted: true } }, { new: true })
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