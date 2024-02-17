import { errorLogger } from "../../middleware/logger/logger.middleware.js";
import UserAuthRepository from "../user/repository/user_auth.repository.js";
import OtpRepository from "./opt.repository.js";
import bcrypt from "bcrypt";

export default class OtpController {
    constructor() {
        this.otpRepository = new OtpRepository();
        this.userAuthRepository = new UserAuthRepository();
    }

    async send(req, res, next) {
        try {
            const { email } = req.body;
            const userAccount = await this.userAuthRepository.getByEmail(email);
            if (!userAccount) {
                return res.status(404).json({ status: false, msg: `Account not found for ${email} email.` });
            }
            const otp = await this.otpRepository.send(email);
            if (!otp) {
                return res.status(400).json({ status: false, msg: `Failed to send otp.` });
            }
            return res.status(200).json({ status: true, msg: `Otp send successfully.` });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to send otp.", error: error.message });
        }
    }

    async verify(req, res, next) {
        try {
            const { email, otp } = req.body;

            const isValid = await this.otpRepository.verify(email,otp.toString());
            if (!isValid) {
                return res.status(400).json({ status: false, msg: `Invalid OTP or time expired, Please resend it if necessary.` });
            }
            return res.status(200).json({ status: true, msg: `Otp verify successfully.` });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to verify otp.", error: error.message });
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            const hashedPassword = await bcrypt.hash(newPassword,12);
            const user = await this.userAuthRepository.getByEmail(email);
            if (!user) {
                return res.status(404).json({ status: false, msg: `user not found.` });
            }
            const isReset = await this.otpRepository.resetPassword(email,hashedPassword);
            if (!isReset) {
                return res.status(400).json({ status: false, msg: `Failed to reset password.` });
            }
            return res.status(200).json({ status: true, msg: `Password reset successfully.` });
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json({ status: false, msg: "Failed to reset password.", error: error.message });
        }
    }
}