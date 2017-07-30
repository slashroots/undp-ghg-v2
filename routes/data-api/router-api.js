var express = require('express');
var router = express.Router();
var App = require('./api-functions');
var Utils = require('../common/utils')

/**
 * End Points relevant to Data Management
 */

router.get('/api/category', Utils.isAuthenticated, App.getCategory);
router.post('/api/category', Utils.isAdmin, App.createCategory);

router.get('/api/sector', Utils.isAuthenticated, App.getSector);
router.post('/api/sector', Utils.isAdmin, App.createSector);

router.get('/api/inventory', Utils.isAuthenticated, App.getInventory);
router.post('/api/inventory', Utils.isAuthenticated, App.createInventory);

router.get('/api/gas', Utils.isAuthenticated, App.getGas);
router.post('/api/gas', Utils.isAuthenticated, App.createGas);

module.exports = router;
