import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import session from "express-session";
import { requestLoggerMiddleware } from "./src/middleware/logger/logger.middleware.js";
import { CustomErrorHandler } from "./src/middleware/error handler/error_handler.middleware.js";
import invalidRoutes from "./src/middleware/error handler/invalidRoutes.middleware.js";
import authRoutes from "./src/feature/user/routes/user.routes.js";
import jwtAuth from "./src/middleware/auth/jwtAuth.middleware.js";
import postRouter from "./src/feature/post/routes/post.routes.js";
import commentRouter from "./src/feature/comment/comment.routes.js";
import likeRouter from "./src/feature/like/like.routes.js";
import friendRouter from "./src/feature/freindships/routes/friend.routes.js";
import otpRouter from "./src/feature/otp reset-password/otp.routes.js";

const server = express();

server.use(bodyParser.json());
server.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:({secure:false})
}));

server.use(requestLoggerMiddleware);

server.get('/api',(req,res)=>{
    res.send('Welcome to Social media backend Api.');
});
server.use('/api/users',authRoutes);
server.use('/api/posts',jwtAuth, postRouter);
server.use('/api/comments',jwtAuth, commentRouter);
server.use('/api/likes',jwtAuth, likeRouter);
server.use('/api/friends',jwtAuth, friendRouter);
server.use('/api/otp', otpRouter);





server.use(CustomErrorHandler);  // for handling application level error
server.use(invalidRoutes);       // for handling invalid routes

export default server;