const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      passport    = require('passport'),
      mongoose    = require('mongoose'),
      users       = require('./routes/api/users'),
      profile     = require('./routes/api/profile'),
      topics      = require('./routes/api/topics'),
      port        = process.env.PORT || 3000;

// parse application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//DB Configuration
const db = require('./config/keys').mongoURI;
//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log(`Mongo DB Connected!`))
.catch(err => console.log(err))

//Passport middleware
app.use(passport.initialize());

//Passport Config with jwt
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/topics', topics);

//Server
app.listen(port, () => console.log(`Server running on port: ${port}`));
