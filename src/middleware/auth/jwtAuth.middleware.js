import UserAuthRepository from "../../feature/user/repository/user_auth.repository.js";
import ApplicationError from "../error handler/error_handler.middleware.js";
import jwt from 'jsonwebtoken';
import { errorLogger } from "../logger/logger.middleware.js";

const jwtAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(new ApplicationError('Unauthorized: Token missing', 401));
    }

    try {
        const payload = jwt.verify(token, process.env.PRIVATE_KEY);
        const isTokenMatch = await UserAuthRepository.matchToken(payload.userId, token);
        if (!isTokenMatch) {
            return next(new ApplicationError('Unauthorized: Invalid token', 401));
        }

        // Set session data
        req.session.token = token;
        req.session.email = payload.email;
        req.session.userId = payload.userId;
        next();
    } catch (error) {
        errorLogger.error(`Error during JWT verification:- ${error.message || error}`)
        console.error('Error during JWT verification:', error.message || error);
        return next(new ApplicationError('Unauthorized: Invalid token', 401));
    }
}

export default jwtAuth;
