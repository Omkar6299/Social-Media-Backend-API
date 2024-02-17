import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import UserProfileRepository from "../repository/user_profile.repository.js";

export default class UserProfileController {
    constructor() {
        this.userProfileRepository = new UserProfileRepository();
    }

    async getSingleUser(req, res, next) {
        try {
            const id = req.params.userId;
            const user = await this.userProfileRepository.getDetails(id);
            return res.status(201).send({ status: true, user: user });
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to retrieve user." });
        }
    };

    async getAllUsers(req, res, next) {
        try {
            const user = await this.userProfileRepository.getDetails();
            return res.status(200).send({ status: true, user: user });
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to retrieve users." });
        }
    }

    async update(req, res, next) {
        try {
            const { name, email, gender } = req.body;
            const userId = req.params.userId;
            // Only self user can update their details.
            if (req.session.userId !== userId) {
                return res.status(404).send({ status: false, msg: "You are not authorized to update details of another user." });
            }
            const updatedUser = await this.userProfileRepository.updateDetails(userId, { name, email, gender });
            return res.status(200).send({ status: true, user: updatedUser });
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to update user details." });
        }
    }

    async updateAvatar(req, res, next) {
        try {
            const avatar = req.file.filename;
            const { userId } = req.session;
            const updatedUser = await this.userProfileRepository.updateAvatar(userId, avatar);
            return res.status(200).send({ status: true, user: updatedUser });
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to update user avatar." });
        }
    }
}