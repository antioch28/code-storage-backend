var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: String,
    description: String,
    ownerId: mongoose.Types.ObjectId,
    created: { type: Date, default: Date.now() },
    lastModified: { type: Date, default: Date.now() },
    starred: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedOn: { type: String, default: '' },
    language: { type: String, default: 'text' },
    code: { type: String, default: '' },
    sharedWith: [{ _id: mongoose.Types.ObjectId }]
});

module.exports = mongoose.model('Snippets', esquema, 'Snippets');