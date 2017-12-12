/**
 * As a guiding principle - each table must have a state... this allows us to deactivate (but not delete!)
 * Created by matjames007 on 9/10/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// mongoose.connect("mongodb://heroku_l0lljssh:36543v53vonm4r1c5qqv1s9eov@ds119223.mlab.com:19223/heroku_l0lljssh");
mongoose.connect(process.env.MONGODB_URI);


/**
 * Users are capable of being tracked throughout the system.  Each user has an assigned role,
 * and state.  The state of a user changes based on the registration with the system and if
 * an administrator wants to deactivate the account.
 */
var UserSchema = new Schema({
    us_user_first_name: {type: String, required: true},
    us_user_last_name: {type: String, required: true},
    us_username: {type: String, required: false, unique: false},
    us_password: {type: String, required: true},
    us_email_address: {type: String, unique:true, required: true},
    us_user_creation_date: {type: Date, default: Date.now()},
    us_state: {type: String, default: 'pending'},
    us_address: {type: String, required: false},
    us_company: {type: String, required: false},
    us_intended_use: {type: String, required: false},
    us_user_role: {type: String, default: 'basic'},
    us_activation_token: {type: String, required: true},
    us_sector_permissions: [Schema.Types.Mixed]
});


/**
  * IPCC Categories
  */
var IPCCCategorySchema = new Schema({
  ica_code: {type: String, required: true, unique: true},
  ica_code_name: {type: String, required: true, trim: true},
  se_sector: {type: Schema.Types.ObjectId, required: true, ref: 'Sector'},
  ica_code_definition: {type: String, required: false},
  ica_modified: {type: Date, default: Date.now()},
  us_user: {type: Schema.Types.ObjectId, required: false, ref: 'User'}
});

/**
  * Local Category
  **/
var CategorySchema = new Schema({
  ca_code: {type: String, required: true, unique: true},
  ca_code_name: {type: String, required: true, trim: true},
  se_sector: {type: Schema.Types.ObjectId, required: true, ref: 'Sector'},
  ca_code_definition: {type: String, required: false},
  ca_modified: {type: Date, default: Date.now()},
  ica_category: {type: Schema.Types.ObjectId, ref: 'IPCCCategory'},
  us_user: {type: Schema.Types.ObjectId, required: false, ref: 'User'}
});

/**
  * The grouping of each Sector
  */
var SectorSchema = new Schema({
  se_name: {type: String, required: true, unique: true},
  se_description: {type: String, required: false},
  se_name_short_code: {type: String, required: true},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  se_modified: {type: Date, default: Date.now()}
});

/**
  * Gases Managed by the Database
  */
var GasSchema = new Schema({
  ga_gas_name: {type: String, required: true, unique: true},
  ga_chem_formula: {type: String, required: true, unique: true},
  ga_gas_gwp: {type: Number, required: true},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  ga_created: {type: Date, default: Date.now()}
});

var InventorySchema = new Schema({
  in_name: {type: String, required: true},
  in_inventory_desc: {type: String, required: true},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  in_creation_date: {type: Date, default: Date.now()},
  in_start_date: {type: Date, required: true, unique: true},
  in_end_date: {type: Date, required: true, unique: true},
  in_status: {type: String, default: "opened"}
});

var IPCCActivitySchema = new Schema({
  iac_name: {type: String, required: true},
  iac_description: {type: String, required: true},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  ac_modification_date: {type: Date, default: Date.now()}
});

var ActivitySchema = new Schema({
  ac_name: {type: String, required: true},
  ac_description: {type: String, required: false},
  ac_modification_date: {type: Date, default: Date.now()},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  iac_activity: {type: Schema.Types.ObjectId, required: false, ref: 'IPCCActivity'}
});

var UnitSchema = new Schema({
  un_unit_name: {type: String, required: true, unique: true},
  un_unit_symbol: {type: String, required: true, unique: true}
});

var DataSchema = new Schema({
  in_inventory: {type: Schema.Types.ObjectId, required: true, ref: 'Inventory'},
  ca_category: {type: Schema.Types.ObjectId, required: false, ref: 'Category'},
  ac_activity: {type: Schema.Types.ObjectId, ref: 'Activity'},
  da_variable_type: {type: String, required: true},
  da_data_value: {type: Number, required: false},
  un_unit: {type: Schema.Types.ObjectId, required: false, ref: 'Unit'},
  ga_gas: {type: Schema.Types.ObjectId, required: false, ref: 'Gas'},
  da_data_modified: {type: Date, default: Date.now()},
  nk_notation_key: {type: Schema.Types.ObjectId, ref: 'NotationKey'},
  da_date: {type: Date, required: false},
  re_region: {type: Schema.Types.ObjectId, ref: 'Region'},
  da_notes: {type: String},
  da_uncertainty_min: {type: Number, required: false},
  da_uncertainty_max: {type: Number, required: false},
  da_data_state: {type:String, required: false},
  issues: [Schema.Types.Mixed]
});

var RegionSchema = new Schema({
  re_region_name: {type: String, required: true, unique: true},
  re_region_desc: {type: String, required: false},
  re_notes:  {type: String, required: false},
  re_data_modified: {type: Date, default: Date.now()},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
});

var NotationKeySchema = new Schema({
  nk_name: {type: String, required: true, unique: true},
  nk_definition: {type: String, required: false, unique: false},
  nk_explanation: {type: String, required: false, unique: false},
  nk_notes: {type: String, required: false, unique: false},
  nk_date_modified: {type: Date, default: Date.now()},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  nk_is_enabled: {type: Boolean, default: true},
});

var LogSchema = new Schema({
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  lo_title: {type: String, required: true},
  lo_desc: {type: String, required: true},
  lo_level: {type: Number, required: true},
  lo_date: {type: Date, required: true, default: Date.now()},
  lo_module: {type: String, required: true}
});

var SupportingFilesSchema = new Schema({
  in_inventory: {type: Schema.Types.ObjectId, required: true, ref: 'Inventory'},
  se_sector: {type: Schema.Types.ObjectId, required: false, ref: 'Sector'},
  description: {type: String, required: false},
  file: {type: String, required: true},
  us_user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  su_date: {type: Date, required: true, default: Date.now()}
});

exports.User = mongoose.model('User', UserSchema);
exports.Category = mongoose.model('Category', CategorySchema);
exports.IPCCCategory = mongoose.model('IPCCCategory', IPCCCategorySchema);
exports.Gas = mongoose.model('Gas', GasSchema);
exports.Sector = mongoose.model('Sector', SectorSchema);
exports.Inventory = mongoose.model('Inventory', InventorySchema);
exports.Activity = mongoose.model('Activity', ActivitySchema);
exports.IPCCActivity = mongoose.model('IPCCActivity', IPCCActivitySchema);
exports.Unit = mongoose.model('Unit', UnitSchema);
exports.Data = mongoose.model('Data', DataSchema);
exports.Region = mongoose.model('Region', RegionSchema);
exports.NotationKey = mongoose.model('NotationKey', NotationKeySchema);
exports.Log = mongoose.model('Log', LogSchema);
exports.SupportingFiles = mongoose.model('SupportingFiles', SupportingFilesSchema);
