var request = require('supertest');

var app = require('../app');

describe("Authentication Route Specs", function(){
    context("POST /authenticate", function(){
        it("Should return a status code of 201", function(done){
            request(app).post('/authenticate')
                .expect(201)
                .end(function(err){
                    if(err) throw err;
                    done();
                });
        });
    });
}); 
