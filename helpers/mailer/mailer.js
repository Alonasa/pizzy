const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true,
    },
});


const sendEmail = async (to, subject, message) => {
    try {
        const mailOptions = {
            from: `Pizzy Pizzeria <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: message,
            html: `<p>${message}</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return `Email sent: ${info.messageId}`;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};

module.exports = {sendEmail};