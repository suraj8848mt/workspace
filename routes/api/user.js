const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key')
const passport = require('passport');

// Load User model
const User = require('../../models/User')
    // @route GET api/users/test
    // @desc Tests Users route
    // @acces Private
router.get('/test', (req, res) => res.json({ msg: "Users Works" }));

// @route GET api/users/register
// @desc Register Users route
// @acces Public
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //Rating
                d: 'mm' // default

            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));

                });
            });
        }
    });
});

// @route GET api/users/login
// @desc Login users / Return JWT tokens
// @acces Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user mail
    User.findOne({ email })
        .then(user => {

            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Match
                        const payLoad = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            } //create jwt payload

                        // Sign Token
                        jwt.sign(
                            payLoad,
                            keys.secretKey, {
                                expiresIn: 3600
                            }, (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });

                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                })
        });
});

// @route GET api/users/current
// @desc Return current User
// @acces Private
router.get('/current', passport.authenticate(
        'jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
    })


module.exports = router;