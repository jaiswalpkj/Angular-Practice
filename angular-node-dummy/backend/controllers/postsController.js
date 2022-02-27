const Post = require("../model/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "post added successfully",
        post: {
          ...result,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Post creation failed",
      });
    });
};
exports.getAllPosts = (req, res, next) => {
  const PageSize = +req.query.pagesize;
  const CurrentPage = +req.query.currentpage;
  let fetchedPost;
  const postQuery = Post.find();
  if (PageSize && CurrentPage) {
    postQuery.skip(PageSize * (CurrentPage - 1)).limit(PageSize);
  }
  postQuery
    .then((document) => {
      fetchedPost = document;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "data received successfully",
        posts: fetchedPost,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not fetch data!",
      });
    });
};
exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Deleted successfully",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Data could not be deleted due to some error!",
      });
    });
};
exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not find the data",
      });
    });
};
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Data updated successfully",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Post could not be updated",
      });
    });
};
