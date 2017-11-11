var model = require('../../model/db');
var Category = model.Category;
var IPCCCategory = model.IPCCCategory;
var Sector = model.Sector;
var Inventory = model.Inventory;
var Gas = model.Gas;
var Unit = model.Unit;
var Region = model.Region;
var NotationKey = model.NotationKey;
var Activity = model.Activity;
var IPCCActivity = model.IPCCActivity;

//############################ IPCC CATEGORY ###################################

/**
  * Find all categories matching search parameters
  */
exports.getIPCCCategory = function(req, res, next) {
  var query = req.querymen;
  IPCCCategory.find(query.query, query.select, query.cursor)
    .populate('se_sector us_user ica_parent')
    .exec(function(err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
};

exports.getIPCCCategoryByID = function(req, res, next) {
  IPCCCategory.findById(req.params.id)
    .populate('se_sector us_user ica_parent')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.updateIPCCCategoryByID = function(req, res, next) {
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

exports.createIPCCCategory = function(req, res, next) {
  var category = new IPCCCategory(req.body);
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

//############################## CATEGORY ######################################

/**
  * Find all categories matching search parameters
  */
exports.getCategory = function(req, res, next) {
  var query = req.querymen;
  Category.find(query.query, query.select)
    .populate('se_sector us_user ica_category')
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
    .populate('se_sector us_user ica_category')
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

//############################## SECTOR ######################################

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


//############################## INVENTORY ######################################
/**
 * Retrieve all inventories
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

//################################# GASES ######################################

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

//############################## ACTIVITY ######################################
exports.getActivities = function(req, res, next) {
  var query = req.querymen;
  Activity.find(query.query, query.select, query.cursor)
    .populate('us_user iac_activity')
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
    .populate('us_user iac_activity')
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
      console.log(err);
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

//################################# UNITS ######################################

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

//############################ IPCC ACTIVITY ###################################
exports.getIPCCActivities = function(req, res, next) {
  var query = req.querymen;
  IPCCActivity.find(query.query, query.select, query.cursor)
    .populate('us_user')
    .exec(function(err, result) {
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getIPCCActivityById = function(req, res, next) {
  Activity.findById(req.params.id)
    .populate('us_user')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.createIPCCActivity = function(req, res, next) {
  var activity = new Activity(req.body);
  activity.save(function(err) {
    if(err) {
      console.log(err);
      next(err);
    } else {
      res.send(activity);
    }
  });
};

exports.updateIPCCActivity = function(req, res, next) {
  Activity.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

//################################ REGION ######################################

exports.getRegion = function(req, res, next) {
  var query = req.querymen;
  Region.find(query.query, query.select, query.cursor)
    .populate('us_user')
    .exec(function(err, result) {
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getRegionByID = function(req, res, next) {
  Region.findById(req.params.id)
    .populate('us_user')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.createRegion = function(req, res, next) {
  var region = new Region(req.body);
  region.us_user = req.user._id;
  region.save(function(err) {
    if(err) {
      next(err);
    } else {
      res.send(region);
    }
  });
};

exports.updateRegion = function(req, res, next) {
  Region.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};


//############################## Notation ######################################

exports.getNotation = function(req, res, next) {
  var query = req.querymen;
  NotationKey.find(query.query, query.select, query.cursor)
    .populate('us_user')
    .exec(function(err, result) {
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getNotationByID = function(req, res, next) {
  NotationKey.findById(req.params.id)
    .populate('us_user')
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

exports.createNotationKey = function(req, res, next) {
  var nk = new NotationKey(req.body);
  nk.us_user = req.user._id;
  nk.save(function(err) {
    if(err) {
      next(err);
    } else {
      res.send(nk);
    }
  });
};

exports.updateNotationKey = function(req, res, next) {
  NotationKey.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};
