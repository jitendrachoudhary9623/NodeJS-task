var request = require("supertest");
var app = require("../app");
var chai = require("chai");
var assert = require("assert");

var expect = chai.expect;
var should = chai.should();
var not = chai.not;
describe("gets all data", function() {
  it("checks if we get all data", function(done) {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("gets data at a specific position", function() {
  it("checks if we get data at 99999", function(done) {
    request(app)
      .get("/99999")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
  it("checks if we get data at 1", function(done) {
    request(app)
      .get("/1")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("checks if we get data at 0", function(done) {
    request(app)
      .get("/0")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});

describe("checking form post request ", function() {
  let data = { name: "12", email: "1@1.com", dob: "" };
  it("respond with 400 not created for invalid data", function(done) {
    request(app)
      .post("/")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
  let data1 = { name: "Jitendra", email: "Jitendra93266@gmail.com", dob: "" };
  it("respond with success", function(done) {
    request(app)
      .post("/")
      .send(data1)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

describe("data validation ", function() {
  let invalid_name = { name: "12", email: "1@1.com", dob: "21/05/1802" };
  let invalid_email = { name: "ABC", email: "1@1", dob: "21/05/1802" };
  let invalid_dob = { name: "ABC", email: "1@1.com", dob: "21/05/2022" };
  let valid_data = {
    name: "ABC",
    email: "jitendra93266@gmail.com",
    dob: "21/05/1997"
  };

  it("invalid name", function(done) {
    request(app)
      .post("/")
      .send(invalid_name)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        res.body.should.have.property("error");
        res.body.error.should.have.property("message").eql("Invalid Name");
        done();
      });
  });

  it("invalid email", function(done) {
    request(app)
      .post("/")
      .send(invalid_email)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        res.body.should.have.property("error");
        res.body.error.should.have.property("message").eql("Invalid Email");
        done();
      });
  });

  it("valid email", function(done) {
    request(app)
      .post("/")
      .send(valid_data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        res.body.should.have.property("success");
        done();
      });
  });
  it("valid date of birth", function(done) {
    request(app)
      .post("/")
      .send(valid_data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        res.body.should.have.property("success");

        done();
      });
  });
});

/*
It'd be nice to see an integration test - i.e.
 requesting data at position x until it gets 404 (so it's found the last entry), 
 then trying to add a new record which keeps failing - first time fails with invalid name,
  then invalid email, then too old, then too young, then success and
   then calls get data at the new position and check its the same as the data submitted.

It's good to submit random data where possible each request so we know it works with any data 
the user enters.


*/
describe("Integration Test", function() {
  for (var i = 1; i < 120; i++) {
    it("checks if we get data at " + i, function(done) {
      request(app)
        .get("/" + i) //if I remove i and place values like 6 the value of i is correctly incremented else it is always finging content at 120
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (res.body.should.have.property("0")) {
            console.log("h");
          }
          describe("after first test case this will execute", function() {
            console.log('here comes '+i);
          });
        });

      done();
    });
  }
});
