var gpio = require('pi-gpio');
var Promise = require('promise');

var actions = {};

var _ON_ = 0;
var _OFF_ = 1;

actions.flash = function(pin, length){
    gpio.open(pin, "output", function(err){
	gpio.write(pin, _ON_, function(err){
	    setTimeout(function(){ gpio.close(pin); }, length || 1000);
	});
    });
};

actions.on = function(pin){
    return new Promise(function(resolve, reject){
	gpio.write(pin, _ON_, function(err){
	    if(err){
		reject(err);	
	    }else{
		resolve();
	    }
	});
    });
};

actions.off = function(pin){
    return new Promise(function(resolve, reject){
	gpio.write(pin, _OFF_, function(err){
	    if(err){
		reject(err);	
	    }else{
		resolve();
	    }
	});
    });
};

module.exports = actions;
