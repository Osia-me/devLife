const express = require('express'),
      router  = express.Router();

// @route GET api/users/test
// @description To test users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'Users works'
}));

module.exports = router;
