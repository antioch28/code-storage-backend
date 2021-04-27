var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now() },
    lastModified: { type: Date, default: Date.now() },
    code: {
        html: String,
        css: String,
        js: String
    }
});

module.exports = mongoose.model('Projects', esquema, 'Projects');