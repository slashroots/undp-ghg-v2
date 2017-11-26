var Crypto = require('crypto');
var nodemailer = require('nodemailer');

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

exports.USER_ACTIVE = 'active';
exports.USER_INACTIVE = 'inactive';
exports.USER_PENDING = 'pending';

/**
 * NODE_MAILER PARAMETERS
 */
exports.MAIL_HOST = process.env.MAIL_HOST || "";
exports.MAIL_PORT = process.env.MAIL_PORT || "";
exports.MAIL_AUTH_USER = process.env.MAIL_AUTH_USER || "";
exports.MAIL_AUTH_PASS = process.env.MAIL_AUTH_PASS || "";

var transporter = nodemailer.createTransport({
  host: exports.MAIL_HOST,
  port: exports.MAIL_PORT,
  secure: false, 
  auth: {
      user: exports.MAIL_AUTH_USER, 
      pass: exports.MAIL_AUTH_PASS 
  }
});

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

exports.sendActivationEmail = function(user, callback) {
  //TODO... based on the generate the email message and send using 
  //node mailer
}