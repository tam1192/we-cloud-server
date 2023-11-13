/**
 * reservd for gui implement
 */
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  // インデックスページを発見！
  // だめだ！　だめだ！　だめだ！
  res.status(404).send('This page is not working.').end();
});

module.exports = router;
