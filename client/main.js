var $ = require('jquery');

// Poll the server for pin status every 1s
setInterval(function(){
  $.ajax({
    url : '/outlets',
    method : 'GET'
  }).then(function(result){
    $('button').each(function(ndx, button){
      var outletStatus = result[parseInt($(button).data('outlet'))];
      if(outletStatus === 'on'){
        $(button).addClass('selected');
      }else if(outletStatus === 'off'){
        $(button).removeClass('selected');
      }
    });
  });
}, 1000);


$('button').on('click', function(){
  var outletNumber = $(this).data('outlet');
  if($(this).hasClass('selected')){
    $.ajax({
      url : '/outlets/' + outletNumber,
      method : 'DELETE'
    }).then(function(){
      $(this).removeClass('selected');
    }.bind(this));
  }else{
    $.ajax({
      url : '/outlets/' + outletNumber,
      method : 'POST'
    }).then(function(){
      $(this).addClass('selected');
    }.bind(this));
  }
});
