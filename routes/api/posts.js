const express = require('express');
const router = express.Router();

// @route GET api/profile/test
// @desc Tests post route
// @acces Public
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;