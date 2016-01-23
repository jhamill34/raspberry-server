var express = require('express');
var app = express();
var router = express.Router();
var Actions = require('./actions');

router.get('/', function(req, res){
  res.status(200).send('hello world');
});


/**
 * GET /flash/:id
 * @param {number} id
 * @param {number} dur
 * @returns json response of GPIO status
 */
router.get('/flash/:id', function(req, res){
    Actions.flash(req.params.id, req.query.dur);
    res.status(200).json({
	status: 'flashed',
	pin: req.params.id,
	durr: req.query.dur
    }); 
});

/**
 * GET /open/:id
 * @param {number} id
 * @returns json of the status
 */
router.get('/open/:id', function(req, res){
   Actions.open(req.params.id).then(function(){
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

/**
 * GET /close/:id
 * @param {number} id
 * @returns json of the status
 */
router.get('/close/:id', function(req, res){
    Actions.close(req.params.id).then(function(){
	res.status(200).json({
	    status: 'closed',
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

app.use('/', router);

app.listen(3000, function(){
  console.log('listening on port 3000');
});
