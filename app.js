"use strict";

//Imports
const express = require("express");
const app = express();
var saveFile = require("./filehandling"); //This have file save and read functions
const bodyParser = require("body-parser");

//mail gun related
var api_key = "key-210eda1f8cdb5cb0dab09eb22a63ee42";
var domain = "sandbox522f221c460e4f9791220f60867d5f4e.mailgun.org";
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

var path = "a.json"; // path of json file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); //loads static content
app.set("view engine", "pug");

//GET,POST REQUESTS

app.get("/form", (req, res) => {
  res.render("index");
});
app.get("/", (req, res) => {
  res.json(JSON.parse(saveFile.read(path)));
});

app.get("/latest", (req, res) => {
  var data1 = JSON.parse(saveFile.read(path));
  //console.log(data1);

  var lastElement = {
    latest: data1.data[data1.data.length - 1]
  };
  res.json(lastElement);
});

app.get("/:number", (req, res, next) => {
  var data1 = JSON.parse(saveFile.read(path));
  var num = req.params.number;
  if (num > data1.data.length || num <= 0) {
    var e = new Error("404 Not Found");
    e.status = 404;
    return next(e);
  } else {
    var requestedData = {
      0: data1.data[num - 1]
    };
    res.json(requestedData);
  }
});

/*
#################################################################
- POST endpoint that takes the following data in JSON format and verifies the format of each field, appends only valid JSON data to a text file then sends a copy of the POSTed data in an email to test@example.com via https://www.mailgun.com/ ‘s API service and includes the machine’s hostname in the email
- name [required, only accepts allowed characters in roman names]
- email [required, must be valid email format]
- date of birth [optional, 2018-02-01 format and requires user is at least 16
years old and must be less than 120 years old] 

##############################################################
*/
app.post("/", (req, res, next) => {
  var name = req.body.name;

  //checks the name if valid
  //if spaces are not allowed remove a extra space which is specified in the regex given below
  if (/[^a-zA-Z ]/.test(name)) {
    var err = new Error("Invalid Name");
    err.status = 400;
    return next(err);
    console.log("this should not execute");
  }
  var email = req.body.email;

  //Regex for email
  var email_regex = /^([a-zA-Z0-9+_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //testing the regex with the email provided by user
  if (!email_regex.test(email)) {
    var err = new Error("Invalid Email");
    err.status = 400;
    return next(err);
  }

  //The below code checks if dob is given or not
  //This is a optional to user
  if (req.body.dob) {
    var div = 1000 * 60 * 60 * 24 * 30 * 12; //This value is of a year
    var dob = new Date(req.body.dob).getTime(); //This returns a timestamp
    var today = new Date().getTime(); //gets the current times timestamp

    //calculating age today - dob
    var age = Math.round((today - dob) / div);

    //Validating the age
    if (age < 0 || age < 16 || age >= 120) {
      var err = new Error(
        "Enter a valid age , Valid age is inbetween 16 and 120."
      );
      err.status = 400;
      return next(err);
    } else {
      dob = req.body.dob;
    }
  } else {
    //If date is not mentioned
    dob = "Not mentioned";
  }
  //This will be given for saving in the text file
  var fileContent = { name: name, email: email, dob: req.body.dob, age: age };

  var from_who =
    "postmaster@sandbox522f221c460e4f9791220f60867d5f4e.mailgun.org";

  //data to be sent
  var data = {
    from: from_who,
    to: `${fileContent.email}`,
    subject: "Your Data",
    text: `name : ${fileContent.name},\n email : ${fileContent.email},\ndob:${
      fileContent.dob
    }\n\n`
  };

  //email sending using mail gun
  var msg = mailgun.messages().send(data, function(err, body) {
    //If any error
    if (err) {
      var err = new Error("Unable to send");
      err.status = 400;
      return next(err);
    } else {
      saveFile.save(fileContent);
      //If success
      res.json({ success: { body } });
    }
  });
});

//catch error 404 and handles it
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  return next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

//exporting for test
module.exports = app.listen(3011, () => {
  console.log("The app is running on port number 3010");
});
