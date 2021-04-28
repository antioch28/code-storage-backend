var mongoose = require('mongoose');
var Plans = require('./plans');

var esquema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profile: { type: String, default: "" },
    plan: {
        _id: mongoose.Types.ObjectId,
        startDate: { type: Date, default: Date.now() },
        endDate: Date
    },
    settings: {
        theme: { type: String, default: "light" },
        editorLayout: { type: String, default: "grid" },
        autoHTMLTemplate: { type: Boolean, default: false }
    },
    paymentMethod: {
        type: {
            cardType: String,
            ownerName: String,
            cardNumber: String,
            expDate: String,
            ccv: String
        },
        default: {}
    }
});

module.exports = mongoose.model('Users', esquema, 'Users');