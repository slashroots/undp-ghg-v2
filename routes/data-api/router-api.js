var express = require('express');
var router = express.Router();
var App = require('./api-functions');
var Utils = require('../common/utils');
var querymen = require('querymen');

/**
 * End Points relevant to Data Management
 */

router.get('/api/category', [Utils.isAuthenticated, querymen.middleware()], App.getCategory);
router.post('/api/category', Utils.isAdmin, App.createCategory);
router.get('/api/category/:id', Utils.isAuthenticated, App.getCategoryByID);
router.put('/api/category/:id', Utils.isAuthenticated, App.updateCategoryByID);

router.get('/api/sector', [Utils.isAuthenticated, querymen.middleware()], App.getSector);
router.post('/api/sector', Utils.isAdmin, App.createSector);
router.get('/api/sector/:id', Utils.isAuthenticated, App.getSectorByID);
router.put('/api/sector/:id', Utils.isAuthenticated, App.updateSectorByID);

router.get('/api/inventory', [Utils.isAuthenticated, querymen.middleware()], App.getInventory);
router.post('/api/inventory', Utils.isAdmin, App.createInventory);
router.get('/api/inventory/:id', Utils.isAdmin, App.getInventoryByID);
router.put('/api/inventory/:id', Utils.isAdmin, App.modifyInventory);

router.get('/api/gas', [Utils.isAuthenticated, querymen.middleware()], App.getGas);
router.get('/api/gas/:id', Utils.isAuthenticated, App.getGasByID);
router.put('/api/gas/:id', Utils.isAuthenticated, App.updateGasByID);
router.post('/api/gas', Utils.isAuthenticated, App.createGas);

router.get('/api/activity', [Utils.isAuthenticated, querymen.middleware()], App.getActivities);
router.get('/api/activity/:id', Utils.isAuthenticated, App.getActivityById);
router.put('/api/activity/:id', Utils.isAdmin, App.updateActivity);
router.post('/api/activity', Utils.isAdmin, App.createActivity);

router.get('/api/unit', [Utils.isAuthenticated, querymen.middleware()], App.getUnits);
router.get('/api/unit/:id', Utils.isAuthenticated, App.getUnitByID);
router.put('/api/unit/:id', Utils.isAdmin, App.updateUnit);
router.post('/api/unit', Utils.isAdmin, App.createUnit);

module.exports = router;
