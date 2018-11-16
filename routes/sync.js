const express = require('express');
const middleware = require('../middleware');

const router = express.Router();

router.get('/', middleware.isLoggedIn, (req, res) => {
  res.render('sync');
});

module.exports = router;
