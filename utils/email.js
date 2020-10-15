const nodemailer = require('nodemailer');

const sendEmail = options => {
    //1. Create a transporter -- define a service, such as gmail.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
    })
    //2. Define email options

    //3. Actually send the email
}