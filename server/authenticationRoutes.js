var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var login = require('./login');
var config = require('../config.js')[process.env.NODE_ENV || 'development'];
var bodyParser = require('body-parser');
const TOKEN_EXP = 3600 * 4; // 4 Hours

router.use(bodyParser.json());

router.post('/', function(req, res){
   login.checkCreds(req.body.uname, 
                    req.body.password, function(err, success){
        if(success){
            jwt.sign({
                uname : req.body.uname,
                exp : Math.floor(Date.now() / 1000) + TOKEN_EXP
            }, config.secret, {
                algorithm : 'HS256'
            }, function(err, token){
                res.status(201).json({
                    token: token 
                });
            });
        }else{
            res.sendStatus(401);
        }
   });
});

module.exports = router;
