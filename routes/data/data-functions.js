var model = require('../../model/db');
var app_logger = require('../common/logger');
var Category = model.Category;
var Sector = model.Sector;
var Inventory = model.Inventory;
var Gas = model.Gas;
var Unit = model.Unit;
var Activity = model.Activity;
var Data = model.Data;


exports.getData = function(req, res, next) {
  var query = req.querymen;
  app_logger.log(app_logger.LOG_LEVEL_INFO, 'Data Request', 'User Requested Inventory Data', 'DATA', req.user._id);
  Data.find(query.query, query.select)
    .populate('ca_category in_inventory re_region ac_activity un_unit ga_gas')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.getDataByID = function(req, res, next) {
  app_logger.log(app_logger.LOG_LEVEL_INFO, 'Data Request', 'User Requested Inventory Data', 'DATA', req.user._id);
  Data.findById(req.params.id)
    .populate('ca_category in_inventory re_region ac_activity un_unit ga_gas')
    .exec(function(err, item) {
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
        console.log(err);
        next(err);
      } else {
        app_logger.log(app_logger.LOG_LEVEL_INFO, 'Data Modification', 'User Modified Inventory Data', 'DATA', req.user._id);
        res.send(item);
      }
    })
};

exports.addNewData = function(req, res, next) {
  var data = new Data(req.body);
  data.save(function(err) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      app_logger.log(app_logger.LOG_LEVEL_INFO, 'Data Creation', 'User Added Inventory Data', 'DATA', req.user._id);
      res.send(data);
    }
  });
};
