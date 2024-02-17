import mongoose from "mongoose";
import friendModel from "../schema/friend.schema.js";
import ApplicationError from "../../../middleware/error handler/error_handler.middleware.js";

export default class FriendRepository {

    async toggle(userId, friendId) {
        try {
            const filter = {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId), friend: new mongoose.Types.ObjectId(friendId) },
                    { user: new mongoose.Types.ObjectId(friendId), friend: new mongoose.Types.ObjectId(userId) }
                ]
            };

            const existingFriend = await friendModel.findOne(filter);

            if (!existingFriend) {
                // If no existing friend relationship, create a new one
                const newFriend = new friendModel({
                    user: new mongoose.Types.ObjectId(userId),
                    friend: new mongoose.Types.ObjectId(friendId),
                    status: "requested"
                });
                await newFriend.save();
                return newFriend;
            } else {
                await friendModel.deleteMany(filter);
                return null;
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async pendingRequest(userId) {
        try {
            const user = await friendModel.findOne({ user: new mongoose.Types.ObjectId(userId) }).select("user -_id").populate({ path: "user", select: "-password -tokens" });
            const requests = await friendModel.find({ user: new mongoose.Types.ObjectId(userId), status: "pending" }).select("friend status -_id").populate({ path: "friend", select: "-password -tokens" });
            return { user, requests };
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async acceptOrReject(userId, friendId, action) {
        try {
            const filter = {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId), friend: new mongoose.Types.ObjectId(friendId), status: "pending" },
                    { user: new mongoose.Types.ObjectId(friendId), friend: new mongoose.Types.ObjectId(userId), status: "requested" }
                ]
            };
            let result = null
            const existing = await friendModel.find(filter);
            if (existing.length !== 2) {
                return result;
            }
            if (action === "accept") {
                result = await friendModel.updateMany(filter, { $set: { status: "friend" } });
            } else {
                result = await friendModel.deleteMany(filter);
            }
            return result;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async getFriends(userId) {
        try {
            const user = await friendModel.findOne({ user: userId }, { user: 1, _id: 0 }).populate({
                path: "user",
                select: "-password -tokens"
            });

            const friends = await friendModel.find({ user: userId, status: "friend" }, { friend: 1, _id: 0 }).populate({
                path: "friend",
                select: "-password -tokens"
            });
            return { user, friends };
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

}