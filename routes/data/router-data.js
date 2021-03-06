var express = require('express');
var router = express.Router();
var App = require('./data-functions');
var Utils = require('../common/utils');
var querymen = require('querymen');

var schema = new querymen.Schema({
  in_inventory: {
    type: String,
    paths: ['in_inventory']
  },
  da_variable_type :{
    type: String,
    paths: ['da_variable_type']
  },
  se_sector: {
    type: String,
    paths: ['se_sector']
  }
}, {
  page: false, // disable default parameter `page`
  limit: 'max_items' // change name of default parameter `limit` to `max_items`
});



/**
 * End Points relevant to Data Management
 */
router.get('/data', [Utils.isAuthenticated, querymen.middleware(schema)], App.getData);
router.post('/data', Utils.isAdmin, App.addNewData);
router.get('/data/:id', Utils.isAuthenticated, App.getDataByID);
router.put('/data/:id', Utils.isAuthenticated, App.updateData);
router.put('/data', Utils.isAuthenticated, App.addNewData);
module.exports = router;
