import express from "express";
import FormValidation from "../../../middleware/validation/formValidation.middleware.js";
import {mediaUpload} from "../../../middleware/file uploads/mediaUpload.middleware.js";
import PostController from "../controller/post.controller.js";

const postRouter = express.Router();
const postController = new PostController();

postRouter.post("/", mediaUpload.single("imageUrl"), FormValidation.postData, (req, res, next) => {
    postController.addPost(req, res, next);
});
postRouter.get('/all', (req, res, next) => {
    postController.getAllPosts(req, res, next);
});
postRouter.get('/', (req, res, next) => {
    postController.getPosts(req, res, next);
});
postRouter.get('/:postId', (req, res, next) => {
    postController.getPost(req, res, next);
});
postRouter.delete('/:postId', (req, res, next) => {
    postController.deletePost(req, res, next);
});
postRouter.put('/:postId', mediaUpload.single("imageUrl"), FormValidation.postData, (req, res, next) => {
    postController.updatePost(req, res, next);
});



export default postRouter;