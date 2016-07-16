var request = require('supertest');

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
        it("should create a json web token on success", function(done){
            var time = Date.now();
            tk.freeze(time);

            var mytoken = jwt.sign({
                uname : 'Josh', 
                exp: Math.floor(Date.now() / 1000) + 3600 * 4
            }, config.secret, {
                algorithm : 'HS256'    
            });
            request(app).post('/authenticate')
                .send({
                    uname : 'Josh',
                    password : 'password'
                })
                .expect(201, {
                    token : mytoken 
                })
                .end(function(err){
                    if(err) throw err;
                    done();
                });
        });
    });
}); 
