const router = require("express").Router();
const authCtrl = require("../controllers/auth.controller");
const { validPassword, validEmail, validNames } = require("../middleware/validInputs");

router.post('/signup', validNames, validEmail, validPassword, authCtrl.signUp);
router.post('/login', validEmail, validPassword, authCtrl.login);

module.exports = router;