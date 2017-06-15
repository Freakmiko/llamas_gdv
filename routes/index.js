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

module.exports = router;
