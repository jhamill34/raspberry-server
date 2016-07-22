/**
 * Sets a timer to start polling for the pin status.
 * This should only be called when we know we are authenticated
 * @param action | function
 * @param frequency | Number
 */
function Poll(action, frequency){
  this.timer = null;
  this.action = action;
  this.frequency = frequency;
}

/**
 * Start the polling mechanism
 * @returns true if it was successful and false if the timer was already going
 */
Poll.prototype.startPolling = function(){
  if(this.timer === null){
    // Poll the server for pin status every 1s
    this.timer = setInterval(this.action, this.frequency);
    return true
  }else{
    return false;
  }
}

/**
 * Check the current status of the timer
 * @returns true if it has been started false if not
 */
Poll.prototype.isPolling = function(){
  return this.timer !== null;
}

/**
 * Invalidates the timer
 */
Poll.prototype.stopPolling = function(){
  if(this.timer === null){
    return false;
  }else{
    clearInterval(this.timer);
    this.timer = null;
  }
}

module.exports = Poll;
