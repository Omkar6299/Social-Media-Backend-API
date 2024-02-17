import mongoose from "mongoose";
import ApplicationError from "../../middleware/error handler/error_handler.middleware.js";
import { errorLogger } from "../../middleware/logger/logger.middleware.js";
import CommentModel from "./comment.schema.js";
import PostModel from "../post/schema/post.schema.js";
import likeModel from "../like/like.schema.js";

export default class CommentRepository {

    async add(content, userId, postId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Create a new comment
            const newComment = await CommentModel.create(
                [{ content: content, user: userId, post: postId }],
                { session: session }
            );

            // Increment the comment count for the specified post
            await PostModel.updateOne(
                { _id: new mongoose.Types.ObjectId(postId) },
                { $inc: { commentCount: 1 } },
                { session: session }
            );

            // Get the comment count for the post
            const commentCount = await CommentModel.countDocuments(
                { post: new mongoose.Types.ObjectId(postId) },
                { session: session }
            );

            await session.commitTransaction();
            session.endSession();

            return { newComment, commentCount };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async getComments(postId) {
        try {
            // const comments  = await CommentModel.aggregate([
            //     {
            //         $match:{post: new mongoose.Types.ObjectId(postId)}
            //     },
            //     {
            //         $group:{_id:"$post",comments :{$push:"$$ROOT"}}
            //     },
            //     {
            //         $lookup:{
            //             from:"users",
            //             localField:"comments.user",
            //             foreignField:"_id",
            //             as:"commentUsers"
            //         }
            //     },
            //     {
            //         $lookup:{
            //             from:"posts",
            //             localField:"comments.post",
            //             foreignField:"_id",
            //             as:"post"
            //         }
            //     },
            //     {
            //         $unwind:"$post"
            //     },
            //     {
            //         $lookup:{
            //             from:"users",
            //             localField:"post.user",
            //             foreignField:"_id",
            //             as:"postUser"
            //         }
            //     },
            // ]);
            const comment = await CommentModel.find({ post: new mongoose.Types.ObjectId(postId) }).populate({ path: "user", select: "name _id email gender" }).populate("content");
            const post = await PostModel.find({ _id: new mongoose.Types.ObjectId(postId) }).populate({ path: "user", select: "name _id email gender" });

            return { comment, post };
        } catch (error) {
            console.error(error);
            throw new ApplicationError(error, 500);
        }
    }

    async delete(userId, commentId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const comment = await CommentModel.findById(commentId).session(session);
            const post = await PostModel.findById(comment.post).session(session);
            let deletedComment = null;

            // Check if the user is the owner of the post or the commenter
            if (userId !== comment.user.toString() && userId !== post.user.toString()) {
                await session.commitTransaction();
                session.endSession();
                return { deletedComment };
            }

             // Delete the comment
            deletedComment = await comment.deleteOne().session(session);

             // Find and delete associated like with comment.
             const { likeDeletedCount } = await likeModel.deleteMany({ likeable: commentId }).session(session);

            await PostModel.updateOne(
                { _id: new mongoose.Types.ObjectId(comment.post) },
                { $inc: { commentCount: -1 } },
                { session:session }
            );

            const commentCount = await CommentModel.countDocuments(
                { post: new mongoose.Types.ObjectId(comment.post) },
                { session:session }
            );

            await session.commitTransaction();
            session.endSession();

            return { deletedComment:comment, commentCount };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async isCommentExist(commeId) {
        try {
            const comment = await CommentModel.findById(commeId);
            return comment ? true : false;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async update(userId, commentId, content) {
        try {
            const comment = await CommentModel.findById(commentId);
            const post = await PostModel.findById(comment.post);
            let updatedComment = null;
            // check userId only belong to postOwner or who comment
            if (userId !== comment.user.toString() && userId !== post.user.toString()) {
                return updatedComment;
            };

            comment.content = content;
            await comment.save();

            return comment;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError(error, 500);
        }
    }

}