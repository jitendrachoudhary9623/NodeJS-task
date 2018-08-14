/*
#####################################################
Note this file's code does not work indepenedantly because of asynchronous and callback nature of the node

*/


var api_key = 'key-210eda1f8cdb5cb0dab09eb22a63ee42';
var domain = 'sandbox522f221c460e4f9791220f60867d5f4e.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
/*exports.sendmail = function send(name, email, age) {
console.log(name);
*/

function sendMail(email){
//var email="jitendra93266@gmail.com";
var name="Jitu";

  var data = {
    from: 'postmaster@sandbox522f221c460e4f9791220f60867d5f4e.mailgun.org',
    to: email,
    subject: name,
    text: 'Why this works!'
  };
  console.log('data a '+data.from);

  console.log('data'+data.to);
  mailgun.messages().send(data).then(result =>{
    console.log('This was the result!');
    console.log(result);
  }).catch(error => {
    console.log('There was an error!')
  });
 

 
}

exports.sendMail=sendMail;
//};

