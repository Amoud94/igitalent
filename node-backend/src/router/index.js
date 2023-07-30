const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const user = require('../components/users');


/**
 *   Api
*/
router.all('/api/users/:action', (req, res) => { user.run(req, res) });




module.exports = router;