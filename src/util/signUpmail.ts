import transporter from "./transporter";
export const  sendSignUpEmail= async (email: string, name: string, activationLink:string) =>{
    try {
        
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Welcome to our website',
            text: `Dear ${name},\n\nThank you for signing up on our website. We are excited to have you on board!\n\nPlease click on the following link to activate your account:\n${activationLink}\n\nBest regards,\nThe Journey Graph Team`,
          };
          
  
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.log('Error sending email:', error);
    }
  }