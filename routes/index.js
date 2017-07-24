var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Greenhouse Gas Database' });
});


/* GET home page. */
router.get('/home', function(req, res, next) {
  if(!req.user) {
    res.redirect('/');
  } else {
    res.render('index', { title: 'Greenhouse Gas Database' });
  }
});

/*registration page*/
router.get('/user-flow/registration', function(req, res, next) {
  res.render('user-flow/registration', { title: 'Greenhouse Gas Database' });
});

module.exports = router;
