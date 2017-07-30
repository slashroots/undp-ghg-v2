var model = require('../../model/db');
var Category = model.Category;
var Sector = model.Sector;
var Inventory = model.Inventory;
var Gas = model.Gas;

exports.getCategory = function(req, res, next) {
  Category.find()
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.createCategory = function(req, res, next) {
  var category = new Category(req.body);
  category.save(function(err) {
    console.log(err);
    if (err) {
      next(err);
    } else {
      res.send(category);
    }
  });
};

exports.getSector = function(req, res, next) {
  Sector.find()
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.createSector = function(req, res, next) {
  var sector = new Sector(req.body);
  sector.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.send(sector);
    }
  });
};

/**
 * Retrieve all invetories
 */
exports.getInventory = function(req, res, next) {
  Inventory.find()
    .populate('us_user')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

/**
 * Create inventory and tag user who performed the action
 */
exports.createInventory = function(req, res, next) {
  var inventory = new Inventory(req.body);
  inventory.us_user = req.user._id;
  inventory.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.send(inventory);
    }
  });
};

/**
 * Retrieve all gases
 */
exports.getGas = function(req, res, next) {
  Gas.find()
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

/**
 * Create gas
 */
exports.createGas = function(req, res, next) {
  var gas = new Gas(req.body);
  gas.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.send(gas);
    }
  });
};
