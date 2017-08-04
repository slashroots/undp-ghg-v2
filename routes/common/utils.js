var Crypto = require('crypto');

/**
 * Generates random value based on the Node.js crypto library
 * @returns a 64bit random hex string
 */
exports.getRandomToken = function() {
    return Crypto.randomBytes(64).toString('hex');
};

exports.ADMIN = 'admin';
exports.MANAGER = 'manager';
exports.REPORTER = 'reporter';
exports.SECTOR_EXPERT = 'sector';

/**
  * These are the possible Inventory states
  */
exports.INVENTORY_STATE = {
  PUBLISHED: 'published',
  OPENED: 'opened',
  IN_REVIEW: 'review',
  CLOSED: 'closed',
  VOID: 'void'
}

hasPermissions = function(req, res, next, access) {
  if (req.isAuthenticated()) {
    if (access == req.user.us_user_role) {
      return next();
    } else {
      var error = new Error("Authorization Necessary " +
        "- Must have " + access + " permissions");
      error.status = 401;
      return next(error);
    }
  } else {
    var error = new Error("Authentication Necessary - Protected Resource");
    error.status = 401;
    return next(error);
  }
};

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    var error = new Error("Authentication Necessary - Protected Resource");
    error.status = 401;
    return next(error);
  }
};

exports.isAdmin = function(req, res, next) {
  return hasPermissions(req, res, next, exports.ADMIN);
};

exports.isManager = function(req, res, next) {
  return hasPermissions(req, res, next, exports.MANAGER);
};

exports.isReporter = function(req, res, next) {
  return hasPermissions(req, res, next, exports.REPORTER);
};

exports.isSectorExpert = function(req, res, next) {
  return hasPermissions(req, res, next, exports.SECTOR_EXPERT);
};
