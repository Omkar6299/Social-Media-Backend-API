import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import UserProfileRepository from "../../user/repository/user_profile.repository.js";
import FriendRepository from "../repository/friend.repository.js"

export default class FriendController {
    constructor() {
        this.friendRepository = new FriendRepository();
        this.userRepository = new UserProfileRepository();
    }

    async toggleFriend(req, res, next) {
        try {
            const { userId } = req.session;
            const { friendId } = req.params;
            if (userId.toString() === friendId.toString()) {
                return res.status(400).json({ status: false, msg: "You self can't add as friend." });
            }
            const friend = await this.userRepository.isUser(friendId);
            if (!friend) {
                return res.status(404).json({ status: false, msg: "User not found for this friendId." });
            }
            const result = await this.friendRepository.toggle(userId, friendId);
            if (!result) {
                return res.status(200).json({ status: true, msg: "Friend deleted successfully." });
            }
            else {
                return res.status(201).json({ status: true, msg: "Friend request sent successfully." });
            }
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to toggle friend.", error: error.message });
        }
    }

    async pendingRequests(req, res, next) {
        try {
            const { userId } = req.session;
            const { user, requests } = await this.friendRepository.pendingRequest(userId);
            if (requests.length < 1) {
                return res.status(200).json({ status: true, msg: "You have no any pending requests yet.", user, requests });
            }
            else {
                return res.status(200).json({ status: true, msg: "Your pending requests yet.", user, requests });
            }
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to toggle friend.", error: error.message });
        }
    }

    async acceptOrRejectRequest(req, res, next) {
        const { userId } = req.session;
        const { friendId } = req.params;
        const { action } = req.query;
        try {
            if (action != "accept" && action != "reject") {
                return res.status(400).json({ status: false, msg: "Invalid  action." });
            }
            const friend = await this.userRepository.isUser(friendId);
            if (!friend) {
                return res.status(404).json({ status: false, msg: "User not found for this friendId." });
            }
            const result = await this.friendRepository.acceptOrReject(userId,friendId,action);
            if (!result) {
                return res.status(400).json({ status: true, msg: `Request not found for this user to take action.` });
            }
            else {
                return res.status(200).json({ status: true, msg: `Request ${action} successfully`, result });
            }
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: `Failed to ${action} request.`, error: error.message });
        }
    }

    async getFriends(req, res, next) {
        try {
            const { userId } = req.params;
            const _user = await this.userRepository.isUser(userId);
            if (!_user) {
                return res.status(404).json({ status: false, msg: "User not found." });
            }

            const { user, friends } = await this.friendRepository.getFriends(userId);
            if (friends.length < 1) {
                return res.status(200).json({ status: true, msg: "You have no any friend.", user, friends });
            }
            else {
                return res.status(200).json({ status: true, msg: "Your friends list.", user, friends });
            }
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to retrieve friends.", error: error.message });
        }
    }
}