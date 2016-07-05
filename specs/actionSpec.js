var expect = require('chai').expect;
var sinon = require('sinon');

var mockRequire = require('mock-require');
var gpioAPI = { write : function(pin, status, callback) {} };
mockRequire('pi-gpio', gpioAPI);

var Actions = require('../server/actions');

describe("PI GPIO Actions", function(){
  var mockGPIO;

  beforeEach(function(){
    mockGPIO = sinon.mock(gpioAPI);
  });

  afterEach(function(){
    mockGPIO.restore();
  });

  context("#on", function(){
    it("should call the write method signaling the gpio to flip high", function(done){
      mockGPIO.expects("write").callsArgWith(2).withArgs("1", 0);

      Actions.on("1").then(function(){
          mockGPIO.verify();
          done();
      });
    });

    it("should reject the promise if there was an error flipping the gpio", function(done){
        mockGPIO.expects("write").callsArgWith(2, "ERROR").withArgs("1", 0);

        Actions.on("1").catch(function(err){
          mockGPIO.verify();
          expect(err).to.equal("ERROR");
          done();
        });
    });
  });

  context("#off", function(){
    it("should call the write method signaling the gpio to flip low", function(done){
      mockGPIO.expects("write").callsArgWith(2).withArgs("1", 1);

      Actions.off("1").then(function(){
          mockGPIO.verify();
          done();
      });
    });

    it("should reject the promise if there was an error flipping the gpio", function(done){
        mockGPIO.expects("write").callsArgWith(2, "ERROR").withArgs("1", 1);

        Actions.off("1").catch(function(err){
          mockGPIO.verify();
          expect(err).to.equal("ERROR");
          done();
        });
    });

  });
});
