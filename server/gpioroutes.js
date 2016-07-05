var express = require('express');
var router = express.Router();
var Actions = require('./actions');

router.post('/:id', function(req, res){
  Actions.on(req.params.id).then(function(){
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

/**
 * GET /on/:id
 * @param {number} id
 * @returns json of the status
 */
router.get('/on/:id', function(req, res){
  Actions.on(req.params.id).then(function(){
    res.status(200).json({
      status: 'on',
      success: true,
      pin: req.params.id
    });
  }).catch(function(err){
    res.status(500).json({
      success: false,
      message: err
    });
  });
});

/**
 * GET /off/:id
 * @param {number} id
 * @returns json of the status
 */
router.get('/off/:id', function(req, res){
  Actions.off(req.params.id).then(function(){
    res.status(200).json({
      status: 'off',
	    success: true,
	    pin: req.params.id
    });
  }).catch(function(err){
    res.status(500).json({
      success: false,
      message: err
    });
  });
});

module.exports = router;
