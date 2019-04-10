const express   = require('express'),
      router    = express.Router(),
      mongoose  = require('mongoose'),
      passport  = require('passport'),
      Profile   = require('../../models/Profile'),
      User      = require('../../models/User');

//Load validation
const validateProfile = require('../../validation/profile');
const validateExperience = require('../../validation/experience');
const validateEducation = require('../../validation/education');

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
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })

    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/user/:id
// @description To get profile by id
// @access Public
router.get('/user/:id', (req,res) => {
  const errors = {};

  Profile.findOne({user: req.params.id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this id';
        res.status(404).json(errors);
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route GET api/profile/user/:username
// @description To get profile by id
// @access Public
router.get('/user/:username', (req,res) => {
  const errors = {};

  Profile.findOne({username: req.params.username})

    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile)
    })

    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route GET api/profile/all
// @description To get all profiles
// @access Public
router.get('/all', (req,res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles){
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({profile: 'There is no profiles for this user'}));
});

// @route POST api/profile
// @description Create or Update user profile
// @access Privat
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

  //Get validation
  const { errors, isValid } = validateProfile(req.body);
  //Check Validation
  if(!isValid){
    //Return errors that comes with 400 Status
    return res.status(400).json(errors);
  }

  //Get fields for general information about profile
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.username) profileFields.username = req.body.username;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
  //Skills as an array
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');
  }
  //Social Links of profile
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({user: req.user.id})
    .then(profile => {
    if(profile){
      //If profile exist -> update the information
      Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true}
      )
      .then(profile => res.json(profile));
    } else {
      //Create new Profile with all fields
      //Check if username exist
      Profile.findOne({ username: profileFields.username})
        .then(profile => {
        //If username(profile username) is exist
        if(profile){
          errors.username = 'That username already exist';
          res.status(400).json(errors);
        }
        //Save new profile information
        new Profile(profileFields).save()
          .then(profile => res.json(profile));
      })
    }
  })

});

// @route POST api/profile/experience
// @description Add experience to profile
// @access Privat

router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res) => {
  //Get validation
  const { errors, isValid } = validateExperience(req.body);
  //Check Validation
  if(!isValid){
    //Return errors that comes with 400 Status
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to experience array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    })
})

// @route POST api/profile/education
// @description Add experience to profile
// @access Privat

router.post('/education', passport.authenticate('jwt', {session: false}), (req,res) => {
  //Get validation
  const { errors, isValid } = validateEducation(req.body);
  //Check Validation
  if(!isValid){
    //Return errors that comes with 400 Status
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to experience array
      profile.education.unshift(newEducation);
      profile.save().then(profile => res.json(profile));
    })
})


module.exports = router;
