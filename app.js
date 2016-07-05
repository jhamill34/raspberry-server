var express = require('express');
var app = express();

app.use(express.static('public'));

app.use('/outlets', require('./server/gpioroutes'));

module.exports = app;
