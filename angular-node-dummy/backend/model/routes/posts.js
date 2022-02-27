const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/postsController");
const extractFiles = require("../../middleware/file");

const checkAuth = require("../../middleware/check-auth");

router.post("", checkAuth, extractFiles, postsController.createPost);
router.get("", postsController.getAllPosts);
router.delete("/:id", checkAuth, postsController.deletePost);
router.get("/:id", postsController.getPostById);
router.put("/:id", checkAuth, extractFiles, postsController.updatePost);
module.exports = router;
