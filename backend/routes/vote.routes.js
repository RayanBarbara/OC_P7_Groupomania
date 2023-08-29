const router = require("express").Router();
const voteCtrl = require("../controllers/vote.controller");
const auth = require("../middleware/auth");

router.post('/:id', auth, voteCtrl.vote);

module.exports = router;