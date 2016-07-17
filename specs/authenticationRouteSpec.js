var request = require('supertest');

var expect = require('chai').expect;

var config = require('../config')[process.env.NODE_ENV || "development"];
var app = require('../app');
var jwt = require('jsonwebtoken');
var tk = require('timekeeper');

describe("Authentication Route Specs", function(){
    // Test login creds are from the test_users.txt file
    context("POST /authenticate", function(){
        it("Should return a status code of 201 for correct login", function(done){
            request(app).post('/authenticate')
                .send({ uname : 'Josh', password : 'password' })
                .expect(201)
                .end(function(err){
                    if(err) throw err;
                    done();
                });
        });
        
        it("Should return a status code of 401 if login is incorrect", function(done){
            request(app).post('/authenticate')
                .send({ uname : 'Josh', password : 'passwo' })
                .expect(401)
                .end(function(err){
                    if(err) throw err;
                    done();
                });
        });
        
        it("Should return a status code of 401 if missing parameter", function(done){
            request(app).post('/authenticate')
                .send({ uname : 'Josh' })
                .expect(401)
                .end(function(err){
                    if(err) throw err;
                    done();
                });
        });
    });

    context("JSON web token", function(){
        it("should be able to verify the token", function(done){
            var time = Date.now();
            tk.freeze(time);

            request(app).post('/authenticate')
                .send({
                    uname : 'Josh',
                    password : 'password'
                })
                .end(function(err, res){
                    if(err) throw err;
                    
                    // Verify the token 
                    jwt.verify(res.body.token, config.secret, function(err, decoded){
                        expect(decoded.uname).to.equal('Josh');   
                        done();
                    }); 
                });
        });

        it("should expire the token after 4 hours", function(done){
            // Freeze the time to NOW 
            var time = Date.now();
            tk.freeze(time);

            request(app).post('/authenticate')
                .send({
                    uname : 'Josh',
                    password : 'password'
                })
                .end(function(err, res){
                    if(err) throw err;
                   
                    // Move time forward to invalidate the token 5 hours
                    var futureDate = time + 3600000 * 5;
                    tk.freeze(futureDate);

                    // Verify the token 
                    jwt.verify(res.body.token, config.secret, function(err, decoded){
                       expect(err).to.not.be.null;
                       tk.reset(); 
                       done();
                    }); 
                });
        });
    });
}); 
