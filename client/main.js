var $ = require('jquery');

// Poll the server for pin status every 1s
setInterval(function(){
  $.ajax({
    url : '/outlets',
    method : 'GET'
  }).then(function(result){
    console.log(result);
    $('button').each(function(button){
      var outletStatus = result[parseInt($(button).data('outlet'))];
      if(outletStatus === 'on'){
        $(button).addClass('selected');
      }else if(outletStatus === 'off'){
        $(button).removeClass('selected');
      }
    });
  });
}, 1000);
