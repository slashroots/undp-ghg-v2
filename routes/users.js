var express = require('express');
var router = express.Router();
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var User = require('../model/db.js').User;
var common = require('./common/utils.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * Function used to send the user details back the application
 * only after successfully authenticating.  This is intended
 * for logging into the API using the local strategy.
 * @param req
 * @param res
 * @param next
 */
exports.authenticate = function(req, res, next) {
  res.send(req.user);
};

/**
 Path for logging in
**/
router.post('/login',
  passport.authenticate('local'),
  exports.authenticate);


/**
 * Setup the local strategy required for login and establish checks
 * for credentials provided during login.
 */
passport.use(new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({
        us_username: username
      }, 'us_username ' +
      'us_user_first_name us_user_last_name us_email_address us_contact ' +
      'us_user_role us_state us_password',
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect credentials.'
          });
        }
        if (user.us_password != password) {
          return done(null, false, {
            message: 'Incorrect credentials.'
          });
        }
        if (user.us_state != 'active') {
          return done(null, false, {
            message: 'User Activation Required.'
          });
        }
        return done(null, user);
      }
    );
  }
));

passport.serializeUser(function(user, done) {
  user.us_password = undefined;
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});



/**
  Create user in the user collection
**/
router.post('/user', function(req, res, next) {
  var user = new User(req.body);
  console.log(req.body);
  user.us_activation_token = common.getRandomToken();
  user.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
});
// User.findOne({us_username: 'matjames007'}, function(err, user) {
//   console.log(err, user);
// });

module.exports = router;
