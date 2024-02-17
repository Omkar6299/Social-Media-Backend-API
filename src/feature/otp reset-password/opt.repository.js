import ApplicationError from "../../middleware/error handler/error_handler.middleware.js";
import UserAuthRepository from "../user/repository/user_auth.repository.js";
import UserModel from "../user/schema/newUser.Schema.js";
import send_OTP from "./mail/mailSender.js";
import OtpModel from "./otp.schema.js";

export default class OtpRepository {

    async send(email) {
        try {
            await OtpModel.findOneAndDelete({ email: email });
            const otp = Math.floor(100000 + Math.random() * 900000);
            await OtpModel.create({ email, otp: otp.toString() });
            await send_OTP(email, otp);
            return otp;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    async verify(email, otp) {
        try {
            // validate otp based on email, otp provided and expiry time.
            const validOtp = await OtpModel.findOne({ email, otp, expiry: { $gte: new Date() } });
            // Remove otp from database if otp is expired or otp is verified once
            await OtpModel.findOneAndDelete({ email, otp });
            // finally return otp if valid else null.
            return validOtp;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

    //for future it is called only when otp is verified
    async resetPassword(email, newPassword) {
        try {
            const user = await UserModel.findOneAndUpdate({email},{$set:{password:newPassword}});
            return user;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(error, 500);
        }
    }

}