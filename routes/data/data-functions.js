var model = require('../../model/db');
var Category = model.Category;
var Sector = model.Sector;
var Inventory = model.Inventory;
var Gas = model.Gas;
var Unit = model.Unit;
var Activity = model.Activity;
var Data = model.Data;


exports.getData = function(req, res, next) {
  var query = req.querymen;
  Data.find(query.query, query.select, query.cursor)
    .populate('se_sector ca_category ac_activity un_unit ga_gas')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.getDataByID = function(req, res, next) {
  Data.findById(req.params.id, function(err, item) {
    if(err) {
      next(err);
    } else {
      res.send(item);
    }
  });
};

exports.updateData = function(req, res, next) {
  Data.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    })
};

exports.addNewData = function(req, res, next) {
  var data = new Data(req.body);
  data.save(function(err) {
    console.log(err);
    if (err) {
      next(err);
    } else {
      res.send(data);
    }
  });
};
