/**
  * File used to read CSV file with IPCC 2006 categories and import into a
  * defined structure.
  **/

var fs = require('fs');
var db = require('../model/db');

function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

var output = read('ipcccategories-xxx.csv', function(data) {
    var rows = data.split("\n");
    var record ={};

    var categories =[];
    var item;

    for(var i = 1; i < rows.length; i++){
      record = rows[i].split("|");
      if(record[5]=="5: Other") {
        categories.push(record[4]);
      }
    }
    

    for(i in categories) {
      var key = categories[i];
      console.log(key);
      var array = key.split(":");
      var iCategory = new db.IPCCCategory({
        ica_code: array[0],
        ica_code_name: array[1],
        se_sector: "597e331a8f47a700114c93fb"
      }).save(function(err,value) {
        console.log(err, value);
      });
    }
});