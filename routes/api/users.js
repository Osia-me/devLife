const express   = require('express'),
      router    = express.Router(),
      User      = require('../../models/User'),
      gravatar  = require('gravatar'),
      bcrypt    = require('bcryptjs'),
      jwt       = require('jsonwebtoken'),
      keys      = require('../../config/keys'),
      passport  = require('passport');

// @route GET api/users/test
// @description To test users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'Users works'
}));

// @route GET api/users/registration
// @description To register User in DataBase and send the information about user back
// @access Public
router.post('/registration', (req,res) => {
  //check if there user by email
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      return res.status(400).json({email: 'Email already exists'});
    } else {

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
          if(err) {console.log(err)}
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err))
        })
      });
    }
  })
});

// @route GET api/users/login
// @description Login User / returning JWT Token
// @access Public
router.post('/login', (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find User By Email
  User.findOne({email: email})
  .then(user => {
    //Check for user
    if(!user){
      return res.status(404).json({email: "User is not found"})
    }
    //Check password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        //generate Sing In token
        const payload = {id: user.id, name: user.name, avatar: user.avatar };
        //to generate token: payload infor about user and secret information, then expiresIn
        jwt.sign(
          payload,
          keys.secretKey,
          {expiresIn: 3600000},
          (err, token) => {
            res.json({
              sucess: true,
              token: 'Bearer' + token
            })
        });
      } else {
        return res.status(400).json({password: 'Password incorrect'});
      }
    })
  })
});

// @route GET api/users/current
// @description Current User
// @access Privat

router.get('/current', passport.authenticate('jwt', {session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
