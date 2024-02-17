import express from "express";
import CommentController from "./comment.controller.js";

const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.post("/:postId", (req, res, next) => {
    commentController.addComment(req, res, next);
});
commentRouter.get("/:postId", (req, res, next) => {
    commentController.getComments(req, res, next);
});
commentRouter.delete("/:commentId", (req, res, next) => {
    commentController.deleteComment(req, res, next);
});
commentRouter.put("/:commentId", (req, res, next) => {
    commentController.updateComment(req, res, next);
});

export default commentRouter;
