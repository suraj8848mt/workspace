const express = require('express');
const mongoose = require('mongoose');

const app = express();

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

app.get('/', (req, res) => res.send('hello'))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running On Port: ${port}`));