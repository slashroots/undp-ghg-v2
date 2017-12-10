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
var Data = model.Data;
var SupportingFiles = model.SupportingFiles,
    multiparty = require('multiparty'),
    fs = require('fs'),
    path = require('path');

//############################ IPCC CATEGORY ###################################

/**
  * Find all categories matching search parameters
  */
exports.getIPCCCategory = function(req, res, next) {
  var query = req.querymen;
  IPCCCategory.find(query.query, query.select)
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
  //check if open inventory already exists
  Inventory.findOne({in_status: "opened"}, function(err,item) {
    if(err) {
      next(err);
    } else {
      if(item) {
        var error = new Error('An Open Inventory Already Exists!');
        error.status = 400;
        next(error);
      } else {
        //if there is no opened inventory, find the last inventory based on 
        //in_end_date and copy data.
        Inventory.find({}).sort('-in_end_date').exec(
          function(err, list) {
            if(err) {
              next(err);
            } else {

              createNewInventory(req, function(err, inventory) {
                if(err) {
                  next(err);
                } else {
                  if(list.length == 0) {
                    //just go ahead and report creation of new inventory
                    res.send(inventory);
                  } else { 
                    var data_new = [];
                    var new_obj = {};
                    Data.find({in_inventory: list[0]._id}).exec(
                      function(err1, data) {
                        for(i in data) {
                          new_obj = {};
                          //I really don't like the way I did this
                          //the delete function doesn't work at all
                          new_obj.in_inventory = inventory._id;
                          new_obj.ca_category = data[i].ca_category;
                          new_obj.ac_activity = data[i].ac_activity;
                          new_obj.da_variable_type = data[i].da_variable_type;
                          new_obj.da_data_value = data[i].da_data_value;
                          new_obj.un_unit = data[i].un_unit;
                          new_obj.ga_gas = data[i].ga_gas;
                          new_obj.da_data_modified = data[i].da_data_modified;
                          new_obj.nk_notation_key = data[i].nk_notation_key;
                          new_obj.da_date = data[i].da_date;
                          new_obj.re_region = data[i].re_region;
                          new_obj.da_notes = data[i].da_notes;
                          new_obj.da_uncertainty_min = data[i].da_uncertainty_min;
                          new_obj.da_uncertainty_max = data[i].da_uncertainty_max;
                          new_obj.da_data_state = data[i].da_data_state;
                          data_new.push(new_obj);
                        }

                        Data.insertMany(data_new, function(error_many, result) {
                          if(error_many) {
                            next(error_many);
                          } else {
                            res.send(inventory);
                          }
                        });
                      }
                    );
                  }
                }
              });
            }
          }
        )
      }
    }
  })

};

/**
 * A helper function to assist with the creation of the 
 * inventory for the main function above.
 */
createNewInventory = function(req, callback) {
  //create the inventory
  var inventory = new Inventory(req.body);
  inventory.us_user = req.user._id;
  inventory.save(function(err) {
      //finally respond with the new inventory
      callback(err, inventory);
  });
}

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


//############################## Supporting Files ######################################

exports.getSupportingFiles = function(req, res, next) {
  var query = req.querymen;
  SupportingFiles.find(query.query, query.select, query.cursor)
    .populate('in_inventory', 'ca_category')
    .exec(function(err, result) {
        console.log(err);
        console.log(result);
      if(err) {
        next(err);
      } else {
        res.send(result);
      }
    });
};

exports.getSupportFile = function(req, res, next) {
  SupportingFiles.findById(req.params.id)
    .exec(function(err, item) {
      if(err) {
        next(err);
      } else {
        res.sendFile(path.join(process.env.UPLOAD_DIR, item.file));
      }
    });
};

exports.createSupportingFiles = function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err)
            next(err);

        fs.rename(files['files[0]'][0]['path'],
            path.join(process.env.UPLOAD_DIR, files['files[0]'][0]['originalFilename']), function(err) {
                if(err)
                    next(err);

                var obj = {
                    'in_inventory': fields['data[in_inventory]'][0],
                    'ca_category': fields['data[ca_category]'][0],
                    'description': fields['data[description]'][0],
                    'file': files['files[0]'][0]['originalFilename']
                }

                var sf = new SupportingFiles(obj);
                sf.save(function(err) {
                    console.log(err);
                    if(err) {
                        next(err);
                    } else {
                        res.send(sf);
                    }
                });
            });
    });
};

exports.updateSupportingFiles = function(req, res, next) {
  SupportingFiles.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    });
};

