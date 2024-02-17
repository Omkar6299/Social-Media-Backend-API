import express from "express";
import FriendController from "../controller/friend.controller.js";

const friendRouter = express.Router();
const friendController = new FriendController();

friendRouter.get("/toggle-friendship/:friendId",(req,res,next)=>{
    friendController.toggleFriend(req,res,next);
});
friendRouter.get("/get-pending-requests",(req,res,next)=>{
    friendController.pendingRequests(req,res,next);
});
friendRouter.get("/response-to-request/:friendId",(req,res,next)=>{
    friendController.acceptOrRejectRequest(req,res,next);
});
friendRouter.get("/get-friends/:userId",(req,res,next)=>{
    friendController.getFriends(req,res,next);
});

export default friendRouter;