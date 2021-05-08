var mongoose = require('mongoose');

var servidor = 'localhost:27017';
var db = 'code-storage';

var dbUrl = process.env.DB_URL || `mongodb://${servidor}/${db}`;

class Database {
    constructor() {
        mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(() => {
                console.log('Connected to MongoDB');
            }).catch((error) => {
                console.log(error);
            });
    }
}

module.exports = new Database();