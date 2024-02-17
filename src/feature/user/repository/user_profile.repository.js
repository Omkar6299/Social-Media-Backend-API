import mongoose from "mongoose";
import ApplicationError from "../../../middleware/error handler/error_handler.middleware.js";
import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import UserModel from "../schema/newUser.Schema.js";

export default class UserProfileRepository {

    async getDetails(id = null) {
        try {
            if (id === null) {
                return await UserModel.find({}).select("-password");
            } else {
                const user = await UserModel.findById(id).select("-password");
                if (!user) {
                    throw new ApplicationError('User not found', 404);
                }
                return user;
            }
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async updateDetails(userId, userData) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                $set: { email: userData.email, name: userData.name, gender: userData.gender }
            }, { new: true }).select("-password -tokens");
            return updatedUser;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async isUser(id){
        try {
                const user = await UserModel.findById(id).select("-password");
                return user;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                $set: { avatar }
            }, { new: true }).select("-password -tokens");
            return updatedUser;
        } catch (error) {
            console.error(error);
            errorLogger.error(error);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }


}