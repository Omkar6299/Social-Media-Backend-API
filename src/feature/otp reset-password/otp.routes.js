import express from "express";
import OtpController from "./otp.controller.js";
import FormValidation from "../../middleware/validation/formValidation.middleware.js";

const otpRouter = express.Router();
const otpController = new OtpController();

otpRouter.post("/send", FormValidation.email, (req,res,next)=>{
  otpController.send(req,res,next);
})
otpRouter.post("/verify", FormValidation.email, (req,res,next)=>{
    otpController.verify(req,res,next);
  })
otpRouter.put("/reset-password", FormValidation.resetPassword, (req,res,next)=>{
    otpController.resetPassword(req,res,next);
  })

export default otpRouter;