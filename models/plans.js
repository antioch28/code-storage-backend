var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: String,
    price: Number,
    projects: Number,
    snippets: Number
});

module.exports = mongoose.model('Plans', esquema, 'Plans');