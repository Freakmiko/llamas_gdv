var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET USA page */
router.get('/usa', function(req, res, next) {
  res.render('usa', { title: 'Express' });
});

/* GET France page */
router.get('/france', function(req, res, next) {
  res.render('france', { title: 'Express' });
});

/* GET Austria page */
router.get('/austria', function(req, res, next) {
  res.render('austria', { title: 'Express' });
});

/* GET SouthKorea page */
router.get('/southKorea', function(req, res, next) {
  res.render('southKorea', { title: 'Express' });
});

/* GET SouthKorea page */
router.get('/all', function(req, res, next) {
  res.render('comparison', { title: 'Express' });
});

module.exports = router;
