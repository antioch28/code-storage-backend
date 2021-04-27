var mongoose = require('mongoose');

var servidor = 'localhost:27017';
var db = 'classroom';
var dbUrl = `mongodb+srv://code-storage-admin:uBVbGTQx0TNqx5N6@cluster0.yd1vv.mongodb.net/?retryWrites=true&w=majority`;

class Database {
    constructor() {
        mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'code-storage-db' })
            .then(() => {
                console.log('Se conecto a mongodb atlas');
            }).catch((error) => {
                console.log(error);
            });
    }
}

module.exports = new Database();