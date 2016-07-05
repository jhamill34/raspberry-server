var express = require('express');
var router = express.Router();
var Actions = require('./actions');

// Mount some pin converting middle ware
var pinLookupTable = require('./pinLookupTable');
var pinStatus = {
    '1' : 'off',
    '2' : 'off',
    '3' : 'off',
    '4' : 'off'
};

router.use('/:id', function(req, res, next){
  if(pinLookupTable[req.params.id] !== undefined){
    next();
  }else{
    res.sendStatus(404);
  }
});

router.get('/', function(req, res){
  res.status(200).json(pinStatus);
});

router.get('/:id', function(req, res){
  res.status(200).json({
    status : pinStatus[req.params.id] || 'off'
  });
});

router.post('/:id', function(req, res){
  Actions.on(pinLookupTable[req.params.id]).then(function(){
    pinStatus[req.params.id] = 'on';

    res.status(201).json({
      status : 'on',
      success : true
    });
  }).catch(function(err){
    res.status(500).json({
      success : false,
      message : err
    });
  });
});

router.delete('/:id', function(req, res){
  Actions.off(pinLookupTable[req.params.id]).then(function(){
      pinStatus[req.params.id] = 'off';

      res.status(200).json({
        status : 'off',
        success : true
      });
  }).catch(function(err){
    res.status(500).json({
      success : false,
      message : err
    });
  });
});

module.exports = router;
