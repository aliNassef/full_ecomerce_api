// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');



const sendEmail = async (options) => {
    const configOptions = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };
    const transporter = nodemailer.createTransport(configOptions);


    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;