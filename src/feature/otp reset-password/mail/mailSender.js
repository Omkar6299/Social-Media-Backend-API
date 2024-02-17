import nodemailer from "nodemailer"

const send_OTP = async (email, otp) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.OTP_SENDER_EMAIL,
            pass: process.env.OTP_SENDER_PASS_KEY
        }
    });

    const mailOption = {
        from: process.env.OTP_SENDER_EMAIL,
        to: email,
        subject: "OTP verification",
        text: `Your one time password is ${otp} for reset password. please don't share it with anybody. it is valid for 10 min`
    }

    try {
        const result = await transport.sendMail(mailOption)
        // console.log('OTP sent successfully');
    } catch (error) {
        // console.log('mail failed to sent with error ', error);
        throw error;
    }
}

export default send_OTP;