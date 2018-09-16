var request = require("supertest");
var app = require("../app");
var chai = require("chai");
var assert = require("assert");

var expect = chai.expect;
var should = chai.should();
var not = chai.not;

var async = require("async");

describe("integrated test 1", function() {
  it("Integrated Test for checking whole api", function() {
    var last_num = 0;
    var last_body = undefined;
    function fun(i) {
      request(app)
        .get("/" + i)
        .then(function(res) {
          if (res.status == 200) {
            last_num = i;
            last_body = res.body;
            fun(i + 1);
          } else if (res.status == 404) {
            last_num = i - 1;

            
            request(app)
              .get("/latest")
              .then(function(resp) {
                assert(last_body, resp.body);

                request(app)
                  .post("/")
                  .send({
                    name: "1abc",
                    email: "jitendra93266@gmail.com",
                    dob: "21/07/1997"
                  })
                  .then(function(res) {
                    assert.equal(res.status, 400);
                  });

                request(app)
                  .post("/")
                  .send({ name: "abcd", email: "", dob: "21/07/1997" })
                  .then(function(res) {
                    assert.equal(res.status, 400);
                  });

                request(app)
                  .post("/")
                  .send({
                    name: "qwerty abcd",
                    email: "jitendra93266@gmail.com",
                    dob: "04/09/2018"
                  })
                  .then(function(res) {
                    assert.equal(res.status, 400);
                    // console.log(res.body.error.message);
                    assert.equal(
                      res.body.error.message,
                      "Enter a valid age , Valid age is inbetween 16 and 120."
                    );
                  });

                request(app)
                  .post("/")
                  .send({
                    name: "abcd",
                    email: "jitendra93266@gmail.com",
                    dob: "04/09/1889"
                  })
                  .then(function(res) {
                    assert.equal(res.status, 400);
                    assert.equal(
                      res.body.error.message,
                      "Enter a valid age , Valid age is inbetween 16 and 120."
                    );
                  });

                request(app)
                  .post("/")
                  .send({
                    name: "abcd",
                    email: "jitendra93266@gmail.com",
                    dob: "04/09/1997"
                  })
                  .then(function(res) {
                    assert.equal(res.status, 200);
                   // console.log(res.body.success);
                  });
              });
          }
        });
    }
    fun(1);
  });
});
