const router = require("express").Router();
const userCtrl = require("../controllers/user.controller");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const { validPassword, validUserDescription } = require("../middleware/validInputs");

router.get('/:id', auth, userCtrl.getUser);
router.put('/:id', auth, multer, validUserDescription, userCtrl.updateUser);
router.delete('/:id', auth, validPassword, userCtrl.deleteUser);

module.exports = router;