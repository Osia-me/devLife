const express   = require('express'),
      app       = express(),
      mongoose  = require('mongoose'),
      users     = require('./routes/api/users'),
      profile     = require('./routes/api/profile'),
      topics     = require('./routes/api/topics'),
      port      = process.env.PORT || 3000;

//DB Configuration
const db = require('./config/keys').mongoURI;
//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log(`Mongo DB Connected!`))
.catch(err => console.log(err))

//Routes
app.get('/', (req, res) => res.send('Hello'));

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/topics', topics);

//Server
app.listen(port, () => console.log(`Server running on port: ${port}`));
