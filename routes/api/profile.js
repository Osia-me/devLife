const express = require('express'),
      router  = express.Router();

// @route GET api/profile/test
// @description To test profile route
// @access Public
router.get('/test', (req, res) => res.json({
        msg: 'Profile works'
      }));

module.exports = router;
