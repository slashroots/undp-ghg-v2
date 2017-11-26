var express = require('express');
var router = express.Router();
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var User = require('../model/db.js').User;
var common = require('./common/utils.js');
var Crypto = require('crypto');

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
        us_email_address: username
      },
      'us_user_first_name us_user_last_name us_email_address us_contact ' +
      'us_user_role us_state us_password',
      function(err, user) {
        var hashed_password = Crypto.createHash('sha256').update(password).digest("hex");
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect credentials.'
          });
        }
        if (user.us_password != hashed_password) {
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
User Registration form submission
**/
router.post('/user-registration', function(req, res, next) {
  var user = new User(req.body);
  user.us_username = req.body.us_email_address;
  user.us_password = Crypto.createHash('sha256').update(req.body.us_password).digest("hex");
  user.us_activation_token = common.getRandomToken();
  user.save(function(err) {
    if (err) {
      next(err);
    } else {
      common.sendActivationEmail(user, function(err, info) {
        if(err) {
          next(err);
        } else {
          res.redirect('/');
        }
      });
      
    }
  });
});


/**
  * Send currently authenticated user to the requester.
  */
router.get('/user', function(req, res, next) {
  res.send(req.user);
})



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

/**
kill the session
**/
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});



router.get('/users', common.isAdmin, function(req, res, next) {
  User.find()
    .select('-us_password -us_activation_token')
    .exec(function(err, users) {
      if(err) {
        next(err);
      } else {
        res.send(users);
      }
    })
});

router.get('/users/:id', common.isAdmin, function(req, res, next) {
  User.findById(req.params.id)
    .select('-us_password -us_activation_token')
    .exec(function(err, user) {
      if(err) {
        next(err);
      } else {
        res.send(user);
      }
    })
});

router.put('/users/:id', common.isAdmin, function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, item) {
      if(err) {
        next(err);
      } else {
        res.send(item);
      }
    })
});


module.exports = router;
