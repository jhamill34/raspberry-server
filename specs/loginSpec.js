var expect = require('chai').expect;

var login = require('../server/login');

describe("Login", function(){
    // The used login creds are from test_users.txt
    context("#checkCreds", function(){
       it("should return false if the login is incorrect", function(done){
           login.checkCreds('Josh', 'wrongpass', function(success){
               expect(success).to.equal(false);
               done(); 
           });            
       });

       it("should return true if login is correct", function(done){
           login.checkCreds('Josh', 'password', function(success){
                expect(success).to.equal(true);
                done();
           });
       });
    });
});
