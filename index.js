const express = require('express');
const app = express();
const helmet = require('helmet');
app.use(express.json());
app.use(helmet());
const {config} = require('./config/index.js');

const articles = require('./routes/articles');
const authApi = require('./routes/auth.js');
const users = require('./routes/users')

const {
    logErrors,
    wrapErrors,
    errorHandler
} = require("./utils/middlewares/errorHandler");

const notFoundHandler = require("./utils/middlewares/notFoundHandler");

app.get('*', (req, res, next) =>{
    next();
});

articles(app);
authApi(app);
users(app);

app.use(notFoundHandler);
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, (err)=>{if(err){console.log(err)}else{console.log(config.port)}});