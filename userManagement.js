//
// TODO: Add a search method to make sure we dont add duplicates
// TODO: Add a delete feature
//

var bcrypt = require('bcrypt');
var fs = require('fs');
var p = require('prompt');
var chalk = require('chalk');

var config = require('./config.json')[process.env.NODE_ENV || 'development'];

const saltRounds = 10;

p.message = chalk.yellow('$ ');
p.delimiter = chalk.white('-');

p.start();

p.get(['uname', 'password'], function(err, result){
    bcrypt.hash(result.password, saltRounds, function(err, hash){
        if(err) throw err;
        
        var newLine = result.uname + ":" + hash + "\n";

        var opts = {
            encoding: 'utf-8', 
            mode: 0o600
        };
        fs.appendFile(config['users_location'], newLine, opts, function(err){
            if(err) throw err;
            console.log(chalk.green("Success!"));
        });
    });
});
