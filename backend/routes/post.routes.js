const router = require("express").Router();
const postCtrl = require("../controllers/post.controller");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const { validPostContent } = require("../middleware/validInputs");

router.get('/', postCtrl.getAllPosts);
router.post('/:id', auth, multer, validPostContent, postCtrl.createPost);
router.put('/:id', auth, multer, validPostContent, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;