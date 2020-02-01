const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


const users = require('./routes/api/user');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/user');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/key').mongoURI;

//connect to MongoDb
mongoose
    .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log("DB Connection Error: ${err.message}");
    });

// passport middleware
app.use(passport.initialize());

// passport Config
require('./config/passport')(passport);

//Use routes
app.use('/api/user', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running On Port: ${port}`));