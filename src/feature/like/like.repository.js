import mongoose from "mongoose";
import ApplicationError from "../../middleware/error handler/error_handler.middleware.js";
import { errorLogger } from "../../middleware/logger/logger.middleware.js";
import CommentModel from "../comment/comment.schema.js";
import PostModel from "../post/schema/post.schema.js";
import likeModel from "./like.schema.js";

export default class LikeRepository {

    async toggle(userId, likeableId, model) {
        try {
            const existingLike = await likeModel.findOneAndDelete({ user: userId, likeable: likeableId, on_model: model });

            if (!existingLike) {
                const newLike = new likeModel({
                    user: userId,
                    likeable: likeableId,
                    on_model: model,
                });

                const result = await this.incrementLikeCount(model, likeableId);
                if (!result) {
                    return false;
                }
                await newLike.save();
                return newLike;
            } else {
                const result = await this.decrementLikeCount(model, likeableId);
                if (!result) {
                    return false;
                }
                return existingLike;
            }
        } catch (error) {
            errorLogger.error(error);
            throw new ApplicationError('Failed to toggle like.', 500);
        }
    }

    async getLikes(likeableId) {
        try {
            const likes = await likeModel.find({ likeable: likeableId })
                .populate({ path: "user", select: "name _id email" })
                .populate("likeable");

            return likes;
        } catch (error) {
            errorLogger.error(error);
            throw new ApplicationError('Failed to get like details.', 500);
        }
    }

    async incrementLikeCount(model, likeableId) {
        const updateQuery = { $inc: { likeCount: 1 } };

        try {
            let result;
            if (model === 'Comment') {
                result = await CommentModel.findOneAndUpdate({ _id: likeableId }, updateQuery);
            } else if (model === 'Post') {
                result = await PostModel.findOneAndUpdate({ _id: likeableId }, updateQuery);
            }
            return result;
        } catch (error) {
            errorLogger.error(error);
            throw new ApplicationError('Failed to increment like count.', 500);
        }
    }

    async decrementLikeCount(model, likeableId) {
        const updateQuery = { $inc: { likeCount: -1 } };
        try {
            let result;
            if (model === 'Comment') {
                result = await CommentModel.findOneAndUpdate({ _id: likeableId }, updateQuery);
            } else if (model === 'Post') {
                result = await PostModel.findOneAndUpdate({ _id: likeableId }, updateQuery);
            }
            return result;
        } catch (error) {
            errorLogger.error(error);
            throw new ApplicationError('Failed to decrement like count.', 500);
        }
    }
}
