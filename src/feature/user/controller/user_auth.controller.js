import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorLogger } from '../../../middleware/logger/logger.middleware.js';
import UserAuthRepository from '../repository/user_auth.repository.js'

export default class UserAuthController {
    constructor() {
        this.userAuthRepository = new UserAuthRepository();
    }

    async register(req, res, next) {
        try {
            const { name, email, gender } = req.body;
            const existingUser = await this.userAuthRepository.getByEmail(email);
            if (existingUser) {
                return res.status(400).send({ status: false, msg: 'Email is already in use' });
            }
            const hashPassword = await bcrypt.hash(req.body.password, 12);
            const newUser = await this.userAuthRepository.register({ name, email, password: hashPassword, gender });
            const { password, ...sanitizedUser } = newUser._doc;
            res.status(201).send({ status: true, user: sanitizedUser });
        } catch (error) {
            errorLogger.error(`Error during user register: ${error.message}`);
            res.status(400).send({ status: false, msg: "Failed to register." });
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        try {

            const user = await this.userAuthRepository.getByEmail(email);
            if (!user) {
                return res.status(400).send({ status: false, msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send({ status: false, msg: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.PRIVATE_KEY, { expiresIn: "30m" });
            const userToken = await this.userAuthRepository.setToken(user._id, token);

            return res.status(200).send({ status: true, msg: 'Login successful', token: userToken });
        } catch (error) {
            errorLogger.error(`Error during user Login: ${error.message}`);
            res.status(400).send({ status: false, msg: "Failed to login." });
        }
    }

    async logout(req, res) {
        try {
            const isRemove = await this.userAuthRepository.removeToken(req.session.userId, req.session.token);
            if (isRemove) {
                req.session.destroy((err) => {
                    if (err) {
                        errorLogger.error(`Error during session destruction: ${err}`);
                        return res.status(501).json({ status: false, msg: `Error during session destruction: ${err}` });
                    }
                    res.send({ status: true, msg: "Logout successful." });
                });
            } else {
                res.send({ status: false, msg: "Failed to logout." });
            }
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to logout." });
        }
    }

    async logoutAllDevice(req, res) {
        try {
            const isRemove = await this.userAuthRepository.removeAllToken(req.session.userId);
            if (isRemove) {
                req.session.destroy((err) => {
                    if (err) {
                        errorLogger.error(`Error during session destruction: ${err}`);
                        return res.status(501).json({ status: false, msg: `Error during session destruction: ${err}` });
                    }
                    res.send({ status: true, msg: "Logout from all devices successful." });
                });
            } else {
                res.send({ status: false, msg: "Failed to logout." });
            }
        } catch (error) {
            errorLogger.error(error);
            res.status(400).send({ status: false, msg: "Failed to logout." });
        }
    }
}
