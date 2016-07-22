var express = require('express');
var app = express();

var config = require('./config.js')[process.env.NODE_ENV || 'development'];
var jwtExpress = require('express-jwt');

app.use(express.static('public'));


app.use(jwtExpress({ secret: config.secret }).unless({path: ['/authenticate']}));

app.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            message : "Invalid token..."
        });
    }
});

//app.use('/outlets', require('./server/gpioroutes'));
app.use('/authenticate', require('./server/authenticationRoutes'));

module.exports = app;
