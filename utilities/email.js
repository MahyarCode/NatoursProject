import nodemailer from 'nodemailer';

import pug from 'pug';
import { convert } from 'html-to-text';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// new Email(user, url).sendWelcome()

export default class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours Co <${process.env.EMAIL}}>`;
    }

    _newTransporter() {
        if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            },
        );

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html),
        };

        // 3) create a transport and send email
        await this._newTransporter().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for 10 minutes)',
        );
    }
}

// const sendEmail = async function (options) {
//     // 1) create a transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });
//     // 2) define email options
//     const mailOptions = {
//         from: 'Natours Co <MyTestEmail@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html:
//     };

//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
