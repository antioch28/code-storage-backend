var mongoose = require('mongoose');
var Plans = require('./plans');

var esquema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profile: { type: String, default: "" },
    plan: {
        planInfo: { type: mongoose.Types.ObjectId, ref: "Plans" },
        startDate: { type: Date, default: Date.now() },
        endDate: Date
    },
    settings: {
        theme: { type: String, default: "light" },
        editorLayout: { type: String, default: "grid" },
        autoHTMLTemplate: { type: Boolean, default: false }
    },
    paymentMethod: {
        ownerName: { type: String, default: '' },
        cardNumber: { type: String, default: '' },
        expDate: { type: String, default: '' },
        ccv: { type: String, default: '' }
    }
});

module.exports = mongoose.model('Users', esquema, 'Users');