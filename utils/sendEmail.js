const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '91f2918251cb7c',
            pass: 'c2ae43c227bb93',
        },
    });
    // send mail with defined transport object
    let message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    console.log(message);
    const info  = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;