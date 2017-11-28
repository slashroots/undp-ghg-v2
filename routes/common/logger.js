var express = require('express');
var Utils = require('./utils');
var router = express.Router();
var model = require('../../model/db');
var Log = model.Log;
var querymen = require('querymen');

/**
 * This schema defines the items query parameters can be
 * made to.
 */
var log_schema = new querymen.Schema({
    us_user: {
      type: String,
      paths: ['us_user']
    },
    lo_level: {
        type: Number,
        paths: ['lo_level']
    },
    lo_module: {
        type: String,
        paths: ['lo_module']
    }
  }, {
    page: false, // disable default parameter `page`
    limit: 'max_items' // change name of default parameter `limit` to `max_items`
  });


/**
 * Function for retrieving the logs from the database.
 */
getLogs = function(req, res, next) {
    var query = req.querymen;
    Logs.find(query.query, query.select)
        .populate('us_user')
        .exec(function(err, logs) {
            if(err) {
                next(err);
            } else {
                res.send(logs);
            }
        })
};

/**
 * Retrieve the specific log details
 */
getLogByID = function(req, res, next) {
    Log.findById(req.params.id)
      .populate('us_user')
      .exec(function(err, log) {
        if(err) {
          next(err);
        } else {
          res.send(log);
        }
      });
  };


router.get('/logs', [Utils.isAuthenticated, querymen.middleware(log_schema)], getLogs);
router.get('/log/:id', Utils.isAuthenticated, getLogByID);

module.exports = router;


/**
 * Logging levels for logs
 */
module.exports.LOG_LEVEL_INFO = 0;
module.exports.LOG_LEVEL_WARN = 1;
module.exports.LOG_LEVEL_NOTIFICATION = 2;
module.exports.LOG_LEVEL_ERROR = 3;
module.exports.LOG_LEVEL_CRITICAL = 4;


/**
 * Log to database.  Will not block or process a callback.
 * @param {*} level 
 * @param {*} title 
 * @param {*} desc 
 * @param {*} module 
 * @param {*} user 
 */
module.exports.log = function(level, title, desc, app_module, user) {
    var log = new Log({
        us_user: user,
        lo_title: title,
        lo_desc: desc,
        lo_module: app_module,
        lo_level: level
    });
    log.save();
};