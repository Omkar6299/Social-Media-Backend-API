import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import PostRepository from "../repository/post.repository.js";

export default class PostController {
    constructor() {
        this.postRepository = new PostRepository();
    }

    async addPost(req, res, next) {
        try {
            const { caption } = req.body;
            const userId = req.session.userId;
            const imageUrl = req.file.filename;
            const newUser = { caption, imageUrl, userId };
            const createdPost = await this.postRepository.add(newUser);
            return res.status(400).send({ status: true, post: createdPost });
        } catch (error) {
            console.log(error);
            errorLogger.error(error);
            return res.status(400).send({ status: false, msg: "Failed to create post." });
        }
    }

    async getPost(req, res, next) {
        try {
            const postId = req.params.postId;
            const post = await this.postRepository.getOne(postId);
            if (!post) {
                return res.status(404).send({ status: false, msg: "Post not found." });
            } else {
                return res.status(200).send({ status: true, post: post });
            }
        } catch (error) {
            console.log(error);
            errorLogger.error(error);
            return res.status(400).send({ status: false, msg: "Failed to retrieve post." });
        }
    }

    async getPosts(req, res, next) {
        try {
            const userId = req.session.userId;
            const posts = await this.postRepository.getPosts(userId);
            if (posts.length < 1) {
                return res.status(404).send({ status: false, msg: "No any post created by this user" });
            } else {
                return res.status(200).send({ status: true, posts: posts });
            }
        } catch (error) {
            console.log(error);
            errorLogger.error(error);
            return res.status(400).send({ status: false, msg: "Failed to retrieve posts." });
        }
    }

    async getAllPosts(req, res, next) {
        try {
            const posts = await this.postRepository.getAllPosts();
            if (posts.length < 1) {
                return res.status(404).send({ status: false, msg: "No any post created by any user yet" });
            } else {
                return res.status(200).send({ status: true, posts: posts });
            }
        } catch (error) {
            console.log(error);
            errorLogger.error(error);
            return res.status(400).send({ status: false, msg: "Failed to retrieve all posts." });
        }
    }

    async deletePost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId } = req.session;

            const post = await this.postRepository.getOne(postId);
            if (!post) {
                return res.status(404).send({ status: false, msg: "Post not found." });
            }

            const deletedPost = await this.postRepository.delete(userId, postId);
            if (!deletedPost) {
                return res.status(404).send({ status: false, msg: "You are not authorized to delete this post." });
            }
            return res.status(200).send({ status: true, msg: "Post deleted successfully", post: deletedPost });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).send({ status: false, msg: "Failed to delete post." });
        }
    }

    async updatePost(req, res, next) {
        try {
            const postId = req.params.postId;
            const userId = req.session.userId;
            const { caption } = req.body;
            const imageUrl = req.file.filename;
            const dataToUpdate = { caption, imageUrl };
            const post = await this.postRepository.getOne(postId);
            if (!post) {
                return res.status(404).send({ status: false, msg: "Post not found." });
            }

            const updatedPost = await this.postRepository.update(userId, postId, dataToUpdate);
            if (!updatedPost) {
                return res.status(404).send({ status: false, msg: "You are not authorized to update post of other." });
            }
            return res.status(200).send({ status: true, msg: "Post updated successfully", post: updatedPost });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).send({ status: false, msg: "Failed to update post." });
        }
    }
}