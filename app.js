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

//GET,POST REQUESTS

app.get("/", (req, res) => {
  res.json(JSON.parse(saveFile.read(path)));
});

app.get("/latest", (req, res) => {
  var data1 = JSON.parse(saveFile.read(path));
  //console.log(data1);
  var lastElement = data1.data[data1.data.length - 1];
  res.json(lastElement);
});

app.get("/:number", (req, res, next) => {
  var data1 = JSON.parse(saveFile.read(path));
  var num = req.params.number;
  if (num > data1.data.length || num <= 0) {
    next(new Error("404 Not Found"));
  } else {
    res.json(data1.data[num - 1]);
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
    next(new Error("Invalid Name"));
  }
  var email = req.body.email;

  //Regex for email
  var email_regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //testing the regex with the email provided by user
  if (!email_regex.test(email)) {
    next(new Error("Invalid Email"));
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
      next(new Error("Enter a valid age , Valid age is inbetween 16 and 120."));
    } else {
      dob = req.body.dob;
    }
  } else {
    //If date is not mentioned
    dob = "Not mentioned";
  }

  //This will be given for saving in the text file
  var fileContent = { name: name, email: email, dob: req.body.dob, age: age };

  //first the mail is sent
  var check = sendMail(fileContent);
  if (check) {
    //should  not save
    res.json(JSON.parse(saveFile.save(fileContent)));
  } else {
    //should save
    /*
This always execute because the function is always returning false
but its not working if i do vice versa
*/

    //res.json(JSON.parse(saveFile.read(path)));
    res.json(JSON.parse(saveFile.save(fileContent)));
    // next(new Error("Unable to send mail"));
  }
});

/*
################################################################################

Sends mail using mail-gun
################################################################################

*/
function sendMail(fileContent) {
  var from_who =
    "postmaster@sandbox522f221c460e4f9791220f60867d5f4e.mailgun.org";

  var data = {
    from: from_who,
    to: `${fileContent.email}`,
    subject: "Your Data",
    text: `name : ${fileContent.name},\n email : ${fileContent.email},\ndob:${
      fileContent.dob
    }\n\n`
  };

  mailgun.messages().send(data, function(err, res) {
    console.log(res);
    return true;
  });
  return false;
}
//catch error 404 and handles it
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
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

app.listen(3010, () => {
  console.log("The app is running on port number 3010");
});
