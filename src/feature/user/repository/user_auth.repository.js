import mongoose from "mongoose";
import ApplicationError from "../../../middleware/error handler/error_handler.middleware.js";
import { errorLogger } from "../../../middleware/logger/logger.middleware.js";
import UserModel from "../schema/newUser.Schema.js";

export default class UserAuthRepository {

    async register(userData) {
        try {
            const newUser = new UserModel({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                gender: userData.gender
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            errorLogger.error(`Error during user register: ${error.message}`);
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error) {
                throw error;
            }
            else {
                console.log(error);
                throw new ApplicationError('Something went wrong with the database', 500);
            }
        }
    }

    async getByEmail(email) {
        try {
            return await UserModel.findOne({ email: email });
        } catch (error) {
            console.log(error);
            errorLogger.error(`Something went wrong with the database: ${error.message}`);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    async setToken(id, token) {
        try {
            const user = await UserModel.findById(id);
            user.tokens.push(token);
            await user.save();
            return user.tokens[user.tokens.length - 1];
        } catch (error) {
            console.log(error);
            errorLogger.error(`Something went wrong with the database: ${error.message}`);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    static async matchToken(userId, tokenToMatch) {
        try {
            const user = await UserModel.findOne({
                _id: new mongoose.Types.ObjectId(userId),
                tokens: tokenToMatch
            });
            return user ? true : false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    async removeToken(userId, token) {
        try {
            const user = await UserModel.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(userId),
                    tokens: token
                },
                {
                    $pull: { tokens: token }
                },
                { new: true }
            );
            return user ? true : false; // Return true if the token was matched and removed, false otherwise
        } catch (error) {
            console.error(error);
            return false; // Return false in case of any error
        }
    }

    async removeAllToken(userId) {
        try {
            const user = await UserModel.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(userId),
                },
                {
                    $set: { tokens: [] }
                },
                { new: true }
            );
            return user ? true : false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
