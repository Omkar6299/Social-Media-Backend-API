import { errorLogger } from "../../middleware/logger/logger.middleware.js";
import CommentRepository from "../comment/comment.repository.js";
import PostRepository from "../post/repository/post.repository.js";
import LikeRepository from "./like.repository.js";

export default class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
        this.postRepository = new PostRepository();
        this.commentRepository = new CommentRepository();
    }

    async toggleLike(req, res, next) {
        try {
            const { userId } = req.session;
            const { likeId } = req.params;
            const { type } = req.query;

            const post = await this.postRepository.getOne(likeId);
            const comment = await this.commentRepository.isCommentExist(likeId);
            if (!post && !comment && type !== "Post" && type !== "Comment") {
                return res.status(400).json({ status: false, msg: "Invalid likeId or type." });
            }

            // Toggle the like based on the determined model
            const toggledLike = await this.likeRepository.toggle(userId, likeId, type);
            if(toggledLike)
             return res.status(200).json({ status: true, toggleLike: toggledLike });
            else
            return res.status(404).json({ status: false, msg: "Invalid likeId not matched with type." });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to toggle like.", error: error.message });
        }
    }


    async getLikes(req, res, next) {
        try {
            const { userId } = req.session;
            const { likeId } = req.params;
            // const { type } = req.query;

            const post = await this.postRepository.getOne(likeId);
            const comment = await this.commentRepository.isCommentExist(likeId);
            if (!post && !comment) {
                return res.status(400).json({ status: false, msg: "Invalid likeId." });
            }

            const likes = await this.likeRepository.getLikes(likeId);
            if (likes.length < 1) {
                return res.status(200).json({ status: true, msg: "There are currently no likes for this." });
            }
            return res.status(200).json({ status: true, likes });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to retrieve likes.", error: error.message });
        }
    }
}