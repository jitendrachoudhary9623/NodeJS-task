var request=require("supertest");
var app=require("../app");
var expect= require('chai').expect;
describe("gets all data",function(){
    it("checks if we get all data",function(done){
        request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200,done);
    });
});

describe("gets data at a specific position",function(){
    it("checks if we get data at 99999",function(done){
        request(app)
        .get('/99999')
        .expect('Content-Type', /json/)
        .expect(200,done);
    });
    it("checks if we get data at 1",function(done){
        request(app)
        .get('/1')
        .expect('Content-Type', /json/)
        .expect(200,done);
    });

    it("checks if we get data at 0",function(done){
        request(app)
        .get('/0')
        .expect('Content-Type', /json/)
        .expect(200,done);
    });
});

describe("checking form post request ",function(){
    let data = {"name":"12","email":"1@1.com","dob":""}
    it('respond with 400 not created for invalid data', function (done) {
        request(app)
            .post('/')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
    let data1 = {"name":"Jitendra","email":"Jitendra93266@gmail.com","dob":""}
    it('respond with success', function (done) {
        request(app)
            .post('/')
            .send(data1)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});