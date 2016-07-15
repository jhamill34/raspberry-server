var fs = require('fs');

var SHA3 = require('sha3');
var config = require('../config.json')[process.env.NODE_ENV || 'development'];

module.exports = {
    checkCreds: function(uname, password, callback){
        // Generate the 512 hash
        var d = new SHA3.SHA3Hash();
        d.update(password);
        var login_string = uname + ":" + d.digest('hex');
        
        fs.readFile(config['users_location'], function(err, data){
            var lines = data.toString().split("\n");
            for(var i = 0; i < lines.length; i++){
                if(result = (lines[i] === login_string)){
                    break;
                }
            }
            callback(result);
        });

    }
}
