const express       = require('express'),
      router        = express.Router(),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      //Model
      Profile       = require('../../models/Profile'),
      Topic         = require('../../models/Topic'),
      //Validation
      validateTopic = require('../../validation/topics');


// @route GET api/topics/test
// @description To test topics route
// @access Public
router.get('/test', (req, res) => res.json({
        msg: 'Topics works'
      }));

// @route GET api/topics
// @description Get all topics
// @access Public
router.get('/', (req,res) => {
  Topic.find()
  //Show topics by the newest
    .sort({date: -1})
    //Return all topics
    .then(topics => res.json(topics))
    .catch(err => res.status(404).json('There is no topics to show'));
});

// @route GET api/topics/:id
// @description Get topic by id
// @access Public
router.get('/:id', (req, res) => {
  Topic.findById(req.params.id)
    .then(topic => res.json(topic))
    .catch(err => res.status(404).json('There is no topic with this id'));
});

// @route POST api/topics
// @description Create topic
// @access Privat
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validateTopic(req.body);

  if(!isValid){
    ///Send all errors
    return res.status(400).json(errors);
  }

  const newPost = new Topic({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post)).catch(err => res.json(err));
});

// @route DELETE api/topics/:id
// @description Delete topic
// @access Privat

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Topic.findById(req.params.id)
      .then(topic => {
        //Check if you own this topic
        if(topic.user.toString() !== req.user.id){
          return res.status(401).json({notauthorized: 'User not authorized'});
        }
        //Delete
        topic.remove().then(() => res.json({success: true}))
      })
      .catch(err => res.json('Post not found'))
    })
});

// @route POST api/topics/like/:id
// @description Like the topic
// @access Privat
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Topic.findById(req.params.id)
      .then(topic => {
        if(topic.likes.filter(like => like.user.toString() === req.user.id).length > 0){
          return res.status(400).json({alreadyLiked: 'User already liked this post'});
        }
        //Add user id to liked array
        topic.likes.unshift({ user: req.user.id});
        topic.save().then(topic => res.json(topic))
      })
      .catch(err => res.json('Post not found'))
    });
});

// @route POST api/topics/unlike/:id
// @description Unlikeike the topic
// @access Privat
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Topic.findById(req.params.id)
      .then(topic => {
        if(topic.likes.filter(like => like.user.toString() === req.user.id).length === 0){
          return res.status(400).json({notLiked: 'You have not yet liked this post'});
        }
        //Get removed index
        const removeIndex = topic.likes.map(item => item.user.toString()).indexOf(req.user.id);
        //Splice out of array
        topic.likes.splice(removeIndex, 1);
        //Save
        topic.save().then(topic => res.json(topic));
      })
      .catch(err => res.json('Post not found'))
    })
})


module.exports = router;
