import mongoose from "mongoose";
import ApplicationError from "../../../middleware/error handler/error_handler.middleware.js";
import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import PostModel from "../schema/post.schema.js";
import CommentModel from "../../comment/comment.schema.js";
import likeModel from "../../like/like.schema.js";

export default class PostRepository {

    async add(postData) {
        try {
            const newPost = await PostModel({ caption: postData.caption, imageUrl: postData.imageUrl, user: new mongoose.Types.ObjectId(postData.userId) });
            await newPost.save();
            return newPost;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async getOne(postId) {
        try {
            const post = await PostModel.findById(postId);
            return post;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async getPosts(userId) {
        try {
            const posts = await PostModel.find({ user: new mongoose.Types.ObjectId(userId) });
            return posts;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async getAllPosts() {
        try {
            const posts = await PostModel.find({});
            return posts;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async delete(userId, postId) {

        try {
            // Check if the user is the owner of the post
            const post = await PostModel.findOne({ _id: postId, user: userId });
            if (post) {

                // Find and delete associated comments with post.
                const { commentDeletedCount } = await CommentModel.deleteMany({ post: postId });

                // Find and delete associated like with post.
                const { likeDeletedCount } = await likeModel.deleteMany({ likeable: postId });

                // Delete the post itself
                const deletedPost = await PostModel.findOneAndDelete({ _id: postId });
                return deletedPost
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async update(userId, postId, dataToUpdate) {
        try {
            const updatedPost = await PostModel.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(postId),
                    user: new mongoose.Types.ObjectId(userId)
                },
                {
                    $set: { caption: dataToUpdate.caption, imageUrl: dataToUpdate.imageUrl }
                },
                { new: true } // To return the updated document
            );
            return updatedPost;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

}