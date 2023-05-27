import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Export the function directly using the 'export' keyword
export default async function sendVerificationCodeToEmail(email, verificationCode) {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            // Configure the email provider
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define the email content
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // console.log('Verification code sent to email:', email);
    } catch (error) {
        console.error('Error sending verification code to email:', error);
    }
}
