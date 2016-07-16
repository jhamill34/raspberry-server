var fs = require('fs');

var bcrypt = require('bcrypt');
var config = require('../config.js')[process.env.NODE_ENV || 'development'];

module.exports = {
    checkCreds: function(uname, password, callback){
        fs.readFile(config['users_location'], function(err, data){
            var lines = data.toString().split("\n");
           
            var line_parts;
            for(var i = 0; i < lines.length; i++){
                line_parts = lines[i].split(":");
                
                if(line_parts.length === 2 && line_parts[0] === uname){
                   break; 
                }
            }

            bcrypt.compare(password, line_parts[1], callback);            
        });

    }
}
