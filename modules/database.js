var mongoose = require('mongoose');

var servidor = 'localhost:27017';
var db = 'code-storage';

// var dbUrl = `mongodb+srv://code-storage-admin:uBVbGTQx0TNqx5N6@cluster0.yd1vv.mongodb.net/?retryWrites=true&w=majority`;
// var dbUrl = process.env.DBURL || `mongodb://${servidor}/${db}`;
var dbUrl = `mongodb://${servidor}/${db}`;

class Database {
    constructor() {
        mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Se conecto a mongodb atlas');
            }).catch((error) => {
                console.log(error);
            });
    }
}

module.exports = new Database();