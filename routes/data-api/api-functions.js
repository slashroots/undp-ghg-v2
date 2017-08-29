var model = require('../../model/db');
var Category = model.Category;
var Sector = model.Sector;
var Inventory = model.Inventory;
var Gas = model.Gas;
var Unit = model.Unit;
var Activity = model.Activity;

/**
  * Find all categories matching search parameters
  */
exports.getCategory = function(req, res, next) {
  var query = req.querymen;
  Category.find(query.query, query.select, query.cursor)
    .populate('se_sector us_user')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.getCategoryByID = function(req, res, next) {
  Category.findById(req.params.id)
    .populate('se_sector us_user')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.updateCategoryByID = function(req, res, next) {
  var category = req.body;
  category.ca_modified = Date.now();
  category.us_user = req.user._id;
  Category.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    })
};

exports.createCategory = function(req, res, next) {
  var category = new Category(req.body);
  category.us_user = req.user._id;
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
  var query = req.querymen;
  Sector.find(query.query, query.select, query.cursor)
    .populate('us_user')
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
  sector.us_user = req.user._id;
  sector.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.send(sector);
    }
  });
};

exports.getSectorByID = function(req, res, next) {
  Sector.findById(req.params.id, function(err, item) {
    if(err) {
      next(err);
    } else {
      res.send(item);
    }
  });
};

exports.updateSectorByID = function(req, res, next) {
  var sector = req.body;
  sector.se_modified = Date.now();
  sector.us_user = req.user._id;
  Sector.findByIdAndUpdate(req.params.id, sector, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    })
};


/**
 * Retrieve all invetories
 */
exports.getInventory = function(req, res, next) {
  var query = req.querymen;
  Inventory.find(query.query, query.select, query.cursor)
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

exports.modifyInventory = function(req, res, next) {
  Inventory.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.getInventoryByID = function(req, res, next) {
  Inventory.findById(req.params.id)
    .populate('us_user')
    .exec(function(err, item){
    if(err) {
      next(err);
    } else {
      res.send(item);
    }
  });
};

/**
 * Retrieve all gases
 */
exports.getGas = function(req, res, next) {
  var query = req.querymen;
  Gas.find(query.query, query.select, query.cursor)
    .populate('us_user')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.getGasByID = function(req, res, next) {
  Gas.findById(req.params.id, function(err, item) {
    if(err) {
      next(err);
    } else {
      res.send(item);
    }
  });
};

exports.updateGasByID = function(req, res, next) {
  Gas.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
}

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

exports.getActivities = function(req, res, next) {
  var query = req.querymen;
  Activity.find(query.query, query.select, query.cursor)
    .populate('ca_category se_sector')
    .exec(function(err, result) {
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getActivityById = function(req, res, next) {
  Activity.findById(req.params.id)
    .populate('ca_category se_sector')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.createActivity = function(req, res, next) {
  var activity = new Activity(req.body);
  activity.save(function(err) {
    if(err) {
      next(err);
    } else {
      res.send(activity);
    }
  });
};

exports.updateActivity = function(req, res, next) {
  Activity.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.getUnits = function(req, res, next) {
  var query = req.querymen;
  Unit.find(query.query, query.select, query.cursor)
    .exec(function(err, result) {
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getUnitByID = function(req, res, next) {
  Unit.findById(req.params.id)
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.createUnit = function(req, res, next) {
  var unit = new Unit(req.body);
  unit.save(function(err) {
    if(err) {
      next(err);
    } else {
      res.send(unit);
    }
  });
};

exports.updateUnit = function(req, res, next) {
  Unit.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};
