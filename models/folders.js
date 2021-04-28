var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now() },
    lastModified: { type: Date, default: Date.now() },
    starred: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedOn: { type: Date, default: null },
    parentFolder: { type: mongoose.Types.ObjectId, default: null },
    ownerId: mongoose.Types.ObjectId,
    sharedWith: [{ _id: mongoose.Types.ObjectId }]
});

module.exports = mongoose.model('Folders', esquema, 'Folders');