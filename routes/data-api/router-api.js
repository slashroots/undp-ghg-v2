var express = require('express');
var router = express.Router();
var App = require('./api-functions');
var Utils = require('../common/utils');
var querymen = require('querymen');

/**
 * Category Schema
 */
var category_schema = new querymen.Schema({
    se_sector: {
      type: String,
      paths: ['se_sector']
    }
  }, {
    page: false, // disable default parameter `page`
    limit: 'max_items' // change name of default parameter `limit` to `max_items`
  });

/**
 * End Points relevant to Settings Management
 */
 router.get('/api/ipcc/category', [Utils.isAuthenticated, querymen.middleware()], App.getIPCCCategory);
 router.post('/api/ipcc/category', Utils.isAdmin, App.createIPCCCategory);
 router.get('/api/ipcc/category/:id', Utils.isAuthenticated, App.getIPCCCategoryByID);
 router.put('/api/ipcc/category/:id', Utils.isAuthenticated, App.updateIPCCCategoryByID);

router.get('/api/category', [Utils.isAuthenticated, querymen.middleware(category_schema)], App.getCategory);
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

router.get('/api/ipcc/activity', [Utils.isAuthenticated, querymen.middleware()], App.getIPCCActivities);
router.get('/api/ipcc/activity/:id', Utils.isAuthenticated, App.getIPCCActivityById);
router.put('/api/ipcc/activity/:id', Utils.isAdmin, App.updateIPCCActivity);
router.post('/api/ipcc/activity', Utils.isAdmin, App.createIPCCActivity);

router.get('/api/ipcc/notationkey', [Utils.isAuthenticated, querymen.middleware()], App.getNotation);
router.get('/api/ipcc/notationkey/:id', Utils.isAuthenticated, App.getNotationByID);
router.put('/api/ipcc/notationkey/:id', Utils.isAdmin, App.updateNotationKey);
router.post('/api/ipcc/notationkey', Utils.isAdmin, App.createNotationKey);

router.get('/api/unit', [Utils.isAuthenticated, querymen.middleware()], App.getUnits);
router.get('/api/unit/:id', Utils.isAuthenticated, App.getUnitByID);
router.put('/api/unit/:id', Utils.isAdmin, App.updateUnit);
router.post('/api/unit', Utils.isAdmin, App.createUnit);

router.get('/api/region', [Utils.isAuthenticated, querymen.middleware()], App.getRegion);
router.get('/api/region/:id', Utils.isAuthenticated, App.getRegionByID);
router.put('/api/region/:id', Utils.isAdmin, App.updateRegion);
router.post('/api/region', Utils.isAdmin, App.createRegion);

module.exports = router;
