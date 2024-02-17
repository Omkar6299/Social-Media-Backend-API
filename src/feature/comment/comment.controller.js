import { errorLogger } from "../../middleware/logger/logger.middleware.js";
import PostRepository from "../post/repository/post.repository.js";
import CommentRepository from "./comment.repository.js";


export default class CommentController {
    constructor() {
        this.commentRepository = new CommentRepository();
        this.postRepository = new PostRepository();
    }

    async addComment(req, res, next) {
        try {
            const { content } = req.body;
            const postId = req.params.postId;
            const userId = req.session.userId;
            const post = await this.postRepository.getOne(postId);
            if (!post) {
                return res.status(404).json({ status: false, msg: "Post not found." });
            }
            const { newComment, commentCount } = await this.commentRepository.add(content, userId, postId);
            return res.status(201).json({ status: true, comment: newComment, commentCount });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to add comment.", error: error.message });
        }
    }

    async getComments(req, res, next) {
        try {
            const postId = req.params.postId;
            const isPost = await this.postRepository.getOne(postId);
            if (!isPost) {
                return res.status(404).json({ status: false, msg: "Post not found." });
            }
            const { comment, post } = await this.commentRepository.getComments(postId);
            if (comment.length < 1) {
                return res.status(200).json({ status: false, msg: "No any comment found on this post.", post });
            }
            return res.status(200).json({ status: true, comments: comment, post });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to retrieve comment.", error: error.message });
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { userId } = req.session;

            const comment = await this.commentRepository.isCommentExist(commentId);
            if (!comment) {
                return res.status(404).json({ status: false, msg: "Comment not found for this Id." });
            }

            const { deletedComment, commentCount } = await this.commentRepository.delete(userId, commentId);
            if (!deletedComment) {
                return res.status(403).json({ status: false, msg: "You are not authorized to delete this comment." });
            }

            return res.status(200).json({ status: true, msg: "Comment deleted successfully", deletedComment, commentCount });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to delete comment.", error: error.message });
        }
    }

    async updateComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { userId } = req.session;
            const { content } = req.body;

            const comment = await this.commentRepository.isCommentExist(commentId);
            if (!comment) {
                return res.status(404).json({ status: false, msg: "Comment not found for this Id." });
            }

            const updatedComment = await this.commentRepository.update(userId, commentId, content);
            if (!updatedComment) {
                return res.status(403).json({ status: false, msg: "You are not authorized to update this comment." });
            }

            return res.status(200).json({ status: true, msg: "Comment updated successfully", updatedComment });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to update the comment.", error: error.message });
        }
    }

}