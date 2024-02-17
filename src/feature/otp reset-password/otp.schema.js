import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique:true
    },
    otp: {
        type: String,
        required: true,
        maxLength:[6,"Enter 6 digit otp"],
        minLength:[6,"Enter 6 digit otp"],
    },
    expiry: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 10 * 60 * 1000)  // set default expiry for 10 minute.
        },
        required: true
    }
}, { timestamps: true });

otpSchema.index({ email: 1, otp: 1 });

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;