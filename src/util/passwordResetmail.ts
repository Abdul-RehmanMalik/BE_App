import transporter from "./transporter";

export const sendPasswordResetMail = async (email: string, name: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Password Reset',
      text: `Dear ${name},\n\nWe have received a request to reset your password. Please click on the following link to reset your password:\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Journey Graph Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ' + info.response);
  } catch (error) {
    console.log('Error sending password reset email:', error);
  }
};