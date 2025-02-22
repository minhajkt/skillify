import nodemailer from 'nodemailer'

export const sendApprovalEmail = async (
  email: string,
  name: string,
  status: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const subject =
    status === "approved"
      ? "Your Tutor Application Has Been Approved"
      : "Your Tutor Application Has Been Rejected";

  const message =
    status === "approved"
      ? `Dear ${name},\n\nWe are pleased to inform you that your tutor application has been approved. Welcome to the platform! You can now create the courses to help the students upskill and land a job in the future. We wish you a happy tenure with us. \nThank you. \nTeam Skillify`
      : `Dear ${name},\n\nWe regret to inform you that your tutor application has been rejected due to some inline policies of Skillify. Please feel free to reapply or contact support for further details. \nThank you \nTeam Skillify`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER, 
    to: email, 
    subject: subject, 
    text: message, 
  });
};



export const sendCourseApprovalEmail = async (
  email: string,
  name: string,
  status: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const subject =
    status === "approved"
      ? "Your Course Request Has Been Approved"
      : "Your Course Request Has Been Rejected";

  const message =
    status === "approved"
      ? `Dear ${name},\n\nWe are pleased to inform you that your course request has been approved. We wish you a happy tenure with us. \nThank you. \nTeam Skillify`
      : `Dear ${name},\n\nWe regret to inform you that your course request has been rejected due to some inline policies of Skillify. Please feel free to reapply or contact support for further details. \nThank you \nTeam Skillify`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  });
};

export const sendCourseEditApprovalEmail = async (
  email: string,
  name: string,
  status: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const subject =
    status === "approved"
      ? "Your Course Edit Request Has Been Approved"
      : "Your Course Edit Request Has Been Rejected";

  const message =
    status === "approved"
      ? `Dear ${name},\n\nWe are pleased to inform you that your course edit request has been approved. The students will now have access to new version. \nThank you. \nTeam Skillify`
      : `Dear ${name},\n\nWe regret to inform you that your course edit request has been rejected due to some inline policies of Skillify. Please feel free to reapply or contact support for further details. \nThank you \nTeam Skillify`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  });
};

