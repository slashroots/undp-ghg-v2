var express = require('express');
var router = express.Router();
var App = require('./data-functions');
var Utils = require('../common/utils');
var querymen = require('querymen');

/**
 * End Points relevant to Data Management
 */
 var schema = new querymen.Schema({
   in_inventory: {
     type: String,
     paths: ['in_inventory']
   }
 });



router.get('/data', [Utils.isAuthenticated, querymen.middleware(schema)], App.getData);
router.post('/data', Utils.isAdmin, App.addNewData);
router.get('/data/:id', Utils.isAuthenticated, App.getDataByID);
router.put('/data/:id', Utils.isAuthenticated, App.updateData);

module.exports = router;
