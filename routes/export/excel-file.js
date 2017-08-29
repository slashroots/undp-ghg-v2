// Require library
var xl = require('excel4node');
var express = require('express');
var router = express.Router();
var model = require('../../model/db');
var Activity = model.Activity;

generateActivityTemplate = function(req, res, next) {
  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('Activity');


  // Reusable styles
  var style1 = wb.createStyle({
    font: {
      color: '#000000',
      size: 11,
      bold: true
    }
  });

  var style2 = wb.createStyle({
    font: {
      color: '#000000',
      size: 11,
      bold: false
    }
  });

  //column header for excel file
  ws.cell(1, 1).string('Category Code Name').style(style1);
  ws.cell(1, 2).string('Activity Name').style(style1);
  ws.cell(1, 3).string('Gas').style(style1);
  ws.cell(1, 4).string('Year').style(style1);
  ws.cell(1, 5).string('Variable Value').style(style1);
  ws.cell(1, 6).string('Unit').style(style1);
  ws.cell(1, 7).string('Variable Value').style(style1);
  ws.cell(1, 8).string('Notation Key').style(style1);
  ws.cell(1, 9).string('Uncertainty Min').style(style1);
  ws.cell(1, 10).string('Uncertainty Max').style(style1);
  ws.cell(1, 11).string('Uncertainty Type').style(style1);
  ws.cell(1, 12).string('Emission Factor').style(style1);
  ws.cell(1, 13).string('Region').style(style1);
  ws.cell(1, 14).string('Notes').style(style1);

  //Category Name	Activity Name	Pollutant Gas Name	Year	Variable Value	Unit Symbol	Variable Type	Notation Key Code	Uncertainty Min %	Uncertainty Max %	Uncertainty Type	Region	Notes

  Activity.find()
    .populate('ca_category se_sector ac_ga_gases')
    .exec(function(err, result) {
      if (err) {
        next(err);
      } else {
        for (var i in result) {
          var j =0;
          while(j < result[i].ac_ga_gases.length) {
            // console.log(j);
            ws.cell(parseInt(i) + 2 + parseInt(j), 1).string(result[i].ca_category.ca_code_name).style(style2);
            ws.cell(parseInt(i) + 2 + parseInt(j), 2).string(result[i].ac_name).style(style2);
            ws.cell(parseInt(i) + 2 + parseInt(j), 3).string(result[i].ac_ga_gases[j].ga_gas_name).style(style2);
            j++;
          }
        }
        wb.write('ActivityTemplate.xlsx', res);
      }
    });
};

router.get('/info', generateActivityTemplate);
module.exports = router;
