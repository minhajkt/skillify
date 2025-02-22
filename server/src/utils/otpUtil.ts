import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


export const sendOtpToEmail = async (email: string): Promise<string> => {
  const otp = generateOtp();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP for Account Verification",
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  // console.log('otp', otp)
  return otp;
};

export const sendEmail = async(email: string, resetToken: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

   const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  //  console.log('reset link is ', resetLink);
   

    const mailOptions = {
      from: "chronocraft17@gmail.com",
      to: email,
      subject: "Your Reset link for changing password",
      text: `Click the link to change your password: ${resetLink}. It will expire in 15 minutes.`,
    };
    await transporter.sendMail(mailOptions);
}


const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

let otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export const validateOtp = async (
  userId: string,
  otp: string
): Promise<boolean> => {
  const storedOtp = otpStore[userId];

  if (!storedOtp) return false;

  const isExpired = Date.now() > storedOtp.expiresAt;
  if (isExpired) {
    delete otpStore[userId];
    return false;
  }

  if (storedOtp.otp === otp) {
    delete otpStore[userId];
    return true;
  }

  return false;
};

export const storeOtp = (userId: string, otp: string) => {
  otpStore[userId] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
};
