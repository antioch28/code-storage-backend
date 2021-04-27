var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    projects: [{ _id: mongoose.Types.ObjectId }],
    profile: String,
    plan: {
        _id: mongoose.Types.ObjectId,
        startDate: Date,
        endDate: Date
    },
    settings: {
        theme: String,
        editorLayout: String,
        autoHTMLTemplate: String
    },
    paymentMethod: {
        _id: mongoose.Types.ObjectId,
        cardType: String,
        ownerName: String,
        cardNumber: String,
        expDate: String,
        ccv: String
    }
});

module.exports = mongoose.model('Users', esquema);