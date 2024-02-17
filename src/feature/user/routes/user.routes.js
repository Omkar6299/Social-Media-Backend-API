import express from 'express';
import UserAuthController from '../controller/user_auth.controller.js';
import FormValidation from '../../../middleware/validation/formValidation.middleware.js';
import jwtAuth from '../../../middleware/auth/jwtAuth.middleware.js';
import UserProfileController from '../controller/user_profile.controller.js';
import { avatarUpload } from '../../../middleware/file uploads/mediaUpload.middleware.js';

const userAuthController = new UserAuthController();
const userProfileController = new UserProfileController();

const authRoutes = express.Router();

authRoutes.post('/signup', FormValidation.newUser, (req,res,next)=>{
    userAuthController.register(req,res,next);
});
authRoutes.post('/signIn', FormValidation.userLogin , (req,res,next)=>{
    userAuthController.login(req,res,next);
});
authRoutes.get('/logout', jwtAuth , (req,res,next)=>{
    userAuthController.logout(req,res,next);
});
authRoutes.get('/logout-all-devices', jwtAuth , (req,res,next)=>{
    userAuthController.logoutAllDevice(req,res,next);
});
authRoutes.get('/get-details/:userId', jwtAuth , (req,res,next)=>{
    userProfileController.getSingleUser(req,res,next);
});
authRoutes.get('/get-all-details', jwtAuth , (req,res,next)=>{
    userProfileController.getAllUsers(req,res,next);
});
authRoutes.put('/update-details/:userId', jwtAuth , FormValidation.updateUser, (req,res,next)=>{
    userProfileController.update(req,res,next);
});
authRoutes.put('/update-avatar/', jwtAuth ,avatarUpload.single("avatar"), FormValidation.imageUpload, (req,res,next)=>{
    userProfileController.updateAvatar(req,res,next);
});

export default authRoutes;