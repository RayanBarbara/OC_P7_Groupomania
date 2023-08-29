const router = require("express").Router();
const commentCtrl = require("../controllers/comment.controller");
const auth = require("../middleware/auth");
const { validCommentContent } = require("../middleware/validInputs");

router.post('/:id', auth, validCommentContent, commentCtrl.createComment);
router.put('/:id', auth, validCommentContent, commentCtrl.updateComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;