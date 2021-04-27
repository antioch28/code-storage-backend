var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now() },
    lastModified: { type: Date, default: Date.now() },
    language: String,
    code: String
});

module.exports = mongoose.model('Snippets', esquema, 'Snippets');