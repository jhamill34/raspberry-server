// mock out dependencies
var sinon = require('sinon');

// Import expectations
var expect = require('chai').expect;
var request = require('supertest');
var promise = require('promise');

// we cant actually use this unless we are on the pi
var mockRequire = require('mock-require');
mockRequire('pi-gpio', { write : function() {} });

// Set up our gpioroute app
var Actions = require('../server/actions');
var pinLookupTable = require('../server/pinLookupTable');
var app = require('../app');
var jwt = require('jsonwebtoken');
var config = require('../config.js')[process.env.NODE_ENV || 'development'];

describe("App routes", function(){
  var mockAction;
  var token;

  beforeEach(function(){
      mockAction = sinon.mock(Actions);

      // Create a basic token with the assumption this user 
      // passed the login validation
      // NOTE: this token does not expire like the normal tokens
      token = jwt.sign({ uname : 'Josh' }, config.secret);
  });

  afterEach(function(){
      mockAction.restore();
  });

  context("GET /outlets", function(){
    it("should return a 401 status when sending an invalid token", function(done){
        request(app).get('/outlets')
          .expect(401)
          .end(function(err){
            if(err) throw err;
            done();
          });
    });
    
    it("should return the json of all the outlets", function(done){
        request(app).get('/outlets')
          .set("Authorization", "Bearer " + token)
          .expect(200, {
            '1' : 'off',
            '2' : 'off',
            '3' : 'off',
            '4' : 'off'
          })
          .end(function(err){
            if(err) throw err;
            done();
          });
    });
  });

  context("GET /outlets/1", function(){
    it("should return a 401 status when sending an invalid token", function(done){
        request(app).get('/outlets/1')
          .expect(401)
          .end(function(err){
            if(err) throw err;
            done();
          });
    });

    it("should return json status of off", function(done){
        request(app).get('/outlets/1')
          .set("Authorization", "Bearer " + token)
          .expect(200, {
            status : 'off'
          })
          .end(function(err){
            if(err) throw err;
            done();
          });
    });

    it("should return json status of on if previously we turned it on", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        resolve();
      });
      mockAction.expects("on").returns(promise);

      request(app).post('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .end(function(err){
          if(err) throw err;
          request(app).get('/outlets/1')
            .set("Authorization", "Bearer " + token)
            .expect(200, {
              status : 'on'
            })
            .end(function(err){
              if(err) throw err;
              done();
            });
        });
    });

    it("should return json status of off if previously we turned it on then off again", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        resolve();
      });
      mockAction.expects("on").returns(promise);
      mockAction.expects("off").returns(promise);

      request(app).post('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .end(function(err){
          if(err) throw err;
          request(app).delete('/outlets/1')
            .set("Authorization", "Bearer " + token)
            .end(function(err){
              if(err) throw err;
              request(app).get('/outlets/1')
                .set("Authorization", "Bearer " + token)
                .expect(200, {
                  status : 'off'
                })
                .end(function(err){
                  if(err) throw err;
                  done();
                })
            });
        });
    });
  });

  context("POST /outlets/1", function(){
    it("should return a 401 status when sending an invalid token", function(done){
        request(app).post('/outlets/1')
          .expect(401)
          .end(function(err){
            if(err) throw err;
            done();
          });
    });

    it("should call Action.on with 1 as the parameter", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        resolve();
      });

      mockAction.expects("on").withArgs(pinLookupTable["1"]).returns(promise);

      request(app).post('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .expect(201, {
          status : 'on',
          success : true
        })
        .end(function(err){
          if(err) throw err;
          mockAction.verify();
          done();
        });
    });

    it("should return a 500 status code if something went wrong", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        reject("ERROR MESSAGE");
      });

      mockAction.expects("on").withArgs(pinLookupTable["1"]).returns(promise);

      request(app).post('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .expect(500, {
          success : false,
          message : "ERROR MESSAGE"
        })
        .end(function(err){
          if(err) throw err;
          mockAction.verify();
          done();
        });

    });
  });

  context("DELETE /outlets/1", function(){
    it("should return a 401 status when sending an invalid token", function(done){
        request(app).delete('/outlets/1')
          .expect(401)
          .end(function(err){
            if(err) throw err;
            done();
          });
    });
    
    it("should call Action.on with 1 as the parameter", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        resolve();
      });

      mockAction.expects("off").withArgs(pinLookupTable["1"]).returns(promise);

      request(app).delete('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .expect(200, {
          status : 'off',
          success : true
        })
        .end(function(err){
          if(err) throw err;
          mockAction.verify();
          done();
        });
    });

    it("should return a 500 status code if something went wrong", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        reject("ERROR MESSAGE");
      });

      mockAction.expects("off").withArgs(pinLookupTable["1"]).returns(promise);

      request(app).delete('/outlets/1')
        .set("Authorization", "Bearer " + token)
        .expect(500, {
          success : false,
          message : "ERROR MESSAGE"
        })
        .end(function(err){
          if(err) throw err;
          mockAction.verify();
          done();
        });
    });
  });
});
