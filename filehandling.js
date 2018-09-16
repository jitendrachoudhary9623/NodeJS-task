var fs = require("fs");

var path = "a.json"; //json filename

/*
appendTOFIle saves the json dump to the json file
it check if the file already exists
if it exists then directly make entry 
else
create the file and push the data to the file

*/
function appendToFile(fileContent) {

  //checking if the fle with path exists or not
  fs.exists(path, function(exists) {
    if (exists) {
      //true
      //read the file
      //split it
      var data = fs
        .readFileSync(path)
        .toString()
        .split("\n");
      //append the data to the end
      data.splice(data.length - 1, 0, JSON.stringify(fileContent) + "\n");
      //join the data array again
      var text = data.join(",");
      //and handle the json format
      text = text.replace(",    ]", "]");
      text = text.replace(",]", "]");

      //writting the the data to the file
      fs.writeFile(path, text, "ascii", function(err) {
        if (err) return console.log(err);
      });
    } else {
      //creating new file with given data
      fs.writeFile(
        path,
        '{"data":[' + JSON.stringify(fileContent) + "\n]}",
        err => {
          if (err) {
            next(err);
          }
          console.log("File has been created");
        }
      );
    }
  });


  //mail.sendMail(fileContent.email);
  //reading the content and sending the response of t he file
  return readFileTxt(path);
}
/*
The following function sends the data from the file

*/
function readFileTxt(path) {
  var contents = fs.readFileSync(path, "ascii");
  //  console.log('fs\n'+contents);
  return contents;
}

exports.save = appendToFile;
exports.read = readFileTxt;
