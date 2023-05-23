const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  }
});

export default transporter;