var gpio = require('pi-gpio');
var Promise = require('promise');

var actions = {};

var _ON_ = 0;
var _OFF_ = 1;


/**
 * Calls out to a gpio pin to turn on
 *
 * @param { Number } pin Number
 * @returns { Promise } a promise that resolves when the pin has successfully
 *   been turned on
 */
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

/**
 * Calls out to a gpio pin to turn off
 *
 * @param { Number } pin number
 * @returns { Promise } a promise that resolves when the pin has successfully been
 *  turned off
 */
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
