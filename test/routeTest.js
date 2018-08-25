var request=require("supertest");
var app=require("../app");
var chai=require('chai');

var expect= chai.expect;
var should = chai.should();
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

describe("data validation ",function(){
    let invalid_data = {"name":"12","email":"1@1.com","dob":"21/05/1802"}
    let valid_data = {"name":"ABC","email":"abc@gmail.com.com","dob":"21/05/1997"}

    it('invalid name',function(done){
        request(app)
        .post('/')
        .send(invalid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err,res) => {
            res.body.should.have.property('error'); 
            res.body.error.should.have.property('message').eql('Invalid Name');
            done();
        });
    });
    it('invalid email',function(done){
        request(app)
        .post('/')
        .send(invalid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err,res) => {
            res.body.should.have.property('error'); 
            done();
        });
    });
    it('invalid date of birth',function(done){
        request(app)
        .post('/')
        .send(invalid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err,res) => {
            res.body.should.have.property('error'); 

            done();
        });
    });
    it('valid name',function(done){
        request(app)
        .post('/')
        .send(valid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err,res) => {
            res.body.should.have.property('success'); 
            done();
        });
    });
    it('valid email',function(done){
        request(app)
        .post('/')
        .send(valid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err,res) => {
            res.body.should.have.property('success'); 
            done();
        });
    });
    it('valid date of birth',function(done){
        request(app)
        .post('/')
        .send(valid_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err,res) => {
            res.body.should.have.property('success'); 

            done();
        });
    });
});


