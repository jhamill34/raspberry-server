var fs = require('fs');

module.exports = {
    checkCreds: function(uname, password, callback){
        var result = uname === 'Josh' && password === 'password';

        callback(result);
    }
}
