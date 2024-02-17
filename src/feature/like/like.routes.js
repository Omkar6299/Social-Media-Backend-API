import express from"express";
import LikeController from "./like.controller.js";

const likeRouter = express.Router();
const likeController = new LikeController();

likeRouter.get("/:likeId",(req,res,next)=>{
    likeController.getLikes(req,res,next);
});
likeRouter.get("/toggle/:likeId",(req,res,next)=>{
    likeController.toggleLike(req,res,next);
})

export default likeRouter;