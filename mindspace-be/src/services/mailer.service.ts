import nodemailer from "nodemailer";
import { env } from "../config/env";
import { otpEmailHtml } from "../templates/otp-email.template";

const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export const sendOtpEmail = async (args: { to: string; otp: string }): Promise<void> => {
    await transport.sendMail({
        from: env.SMTP_FROM,
        to: args.to,
        subject: "Your MindSpace verification code",
        html: otpEmailHtml(args.otp, args.to),
    });
};
