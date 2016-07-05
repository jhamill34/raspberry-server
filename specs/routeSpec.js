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
var app = require('../app');

describe("App routes", function(){
  var mockAction;
  beforeEach(function(){
      mockAction = sinon.mock(Actions);
  });

  context("POST /outlets/1", function(){
    it("should call Action.on with 1 as the parameter", function(done){
      // Force the promise to resolve
      var promise = new Promise(function(resolve, reject){
        resolve();
      });

      mockAction.expects("on").withArgs("1").returns(promise);

      request(app).post('/outlets/1')
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

      mockAction.expects("on").withArgs("1").returns(promise);

      request(app).post('/outlets/1')
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
