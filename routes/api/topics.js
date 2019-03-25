const express = require('express'),
      router  = express.Router();

// @route GET api/topics/test
// @description To test topics route
// @access Public
router.get('/test', (req, res) => res.json({
        msg: 'Topics works'
      }));

module.exports = router;
