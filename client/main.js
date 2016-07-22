var $ = require('jquery');
var Poll = require('./poll');

const TOKEN = 'TOKEN';

/**
 * Send a message to the alert dialog that will flash it on the screen
 * for 5s and then disappear
 * @param message | String
 * @param status | String the class that you want alerted
 */
function postAlert(message, status){
  var alert = $(".alert");
  alert.html(message);
  alert.addClass(status);
  alert.addClass("active")
  setTimeout(function(){
    alert.removeClass("active")
    setTimeout(function(){
      alert.removeClass(status);
    }, 500);
  }, 5000)
}

// Poll object that will ask for current state of the GPIOs
// if at any point the request becomes Invalid
// we will attempt to stop the polling
var p = new Poll(function(){
  if(sessionStorage.getItem(TOKEN)){
    $.ajax({
      url : '/outlets',
      method : 'GET',
      headers : {
        'Authorization' : 'Bearer ' + sessionStorage.getItem(TOKEN)
      }
    }).done(function(result){
      $('.container button').each(function(ndx, button){
        var outletStatus = result[parseInt($(button).data('outlet'))];
        if(outletStatus === 'on'){
          $(button).addClass('selected');
        }else if(outletStatus === 'off'){
          $(button).removeClass('selected');
        }
      });
    }).fail(function(jqXHR, textStatus){
      if(jqXHR.status === 401){
        // open up the login dialog
        $(".login-area").addClass("active");
        p.stopPolling();
      }
    });
  }else{
    $(".login-area").addClass("active");
    p.stopPolling();
  }
}, 1000);

// Do a quick check to see if we have a stored auth token
// if we dont' open up the login dialog
// TODO: turn this into a check for session variables
setTimeout(function(){
    $(".login-area").addClass("active");
}, 2000);

// Form submit callback
// Will post an alert if login was invalid.
// Starts polling if successful
$(".login-area form").submit(function(e){
  e.preventDefault();

  var loginObj = {
    uname : $('input[name=username]').val(),
    password : $('input[name=password]').val()
  };

  $.ajax({
      url : '/authenticate',
      method : 'POST',
      dataType : 'json',
      contentType : 'application/json',
      data : JSON.stringify(loginObj)
  }).done(function(data, status){
    sessionStorage.setItem(TOKEN, data.token);
    $('.login-area').removeClass('active');
    p.startPolling();
  }).fail(function(jqXHR, textStatus, errorThrown){
    if(jqXHR.status === 401){
      // Let them know they have the wrong login to try again
      postAlert(textStatus, "fail");
      p.startPolling();
    }
  });
});

// Validate input on the form text areas
$("input").keyup(function(){
  if($(this).val() !== ''){
    $(this).removeClass('ng-invalid');
    $(this).addClass('ng-valid');
  }else{
    $(this).removeClass('ng-valid');
    $(this).addClass('ng-invalid');
  }
});

// Attempt to toggle the GPIO pin
// If unauthenticated will bring up the login dialog
$('.container button').click(function(){
  if(sessionStorage.getItem(TOKEN)){
    var outletNumber = $(this).data('outlet');
    if($(this).hasClass('selected')){
      $.ajax({
        url : '/outlets/' + outletNumber,
        method : 'DELETE',
        headers : {
          'Authorization' : 'Bearer ' + sessionStorage.getItem(TOKEN)
        }
      }).done(function(){
        $(this).removeClass('selected');
      }.bind(this)).fail(function(jqXHR, textStatus){
        if(jqXHR.status === 401){
          // open up the login dialog
          $(".login-area").addClass("active");
          p.stopPolling();
        }
      });
    }else{
      $.ajax({
        url : '/outlets/' + outletNumber,
        method : 'POST',
        headers : {
          'Authorization' : 'Bearer ' + sessionStorage.getItem(TOKEN)
        }
      }).then(function(){
        $(this).addClass('selected');
      }.bind(this)).fail(function(jqXHR, textStatus){
        if(jqXHR.status === 401){
          // open up the login dialog
          $(".login-area").addClass("active");
          p.stopPolling();
        }
      });
    }
  }else{
    $(".login-area").addClass("active");
    p.stopPolling();
  }
});
