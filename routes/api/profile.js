const express   = require('express'),
      router    = express.Router()
      mongoose  = require('mongoose'),
      passport  = require('passport'),
      Profile   = require('../../models/Profile'),
      User      = require('../../models/User');

// @route GET api/profile/test
// @description To test profile route
// @access Public
router.get('/test', (req, res) => res.json({
        msg: 'Profile works'
      }));

// @route GET api/profile
// @description To get current users profile
// @access Privat
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json("Status not found!"));
});

module.exports = router;
