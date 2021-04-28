var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var database = require('./modules/database');

var port = process.env.port || 3000;

// Routers
var authRouter = require('./routers/auth-router');
var foldersRouter = require('./routers/folders-router');
var usersRouter = require('./routers/users-router');
var projectsRouter = require('./routers/projects-router');
var snippetsRouter = require('./routers/snippets-router');
var plansRouter = require('./routers/plans-router');


var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/folders', foldersRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/snippets', snippetsRouter);
app.use('/plans', plansRouter);

app.listen(port, () => {
    console.log('Servidor del backend levantado en ' + port);
});