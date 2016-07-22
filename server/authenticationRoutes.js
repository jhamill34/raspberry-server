var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var login = require('./login');
var config = require('../config.js')[process.env.NODE_ENV || 'development'];
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/', function(req, res){
   login.checkCreds(req.body.uname,
                    req.body.password, function(err, success){
        if(success){
            jwt.sign({
                uname : req.body.uname
            }, config.secret, {
                algorithm : 'HS256',
                expiresIn : '4h'
            }, function(err, token){
                res.status(201).json({
                    token: token
                });
            });
        }else{
            res.status(401).json({
                message : "Incorrect Login..."
            });
        }
   });
});

module.exports = router;
