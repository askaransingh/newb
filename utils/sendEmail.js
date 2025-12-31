import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS, // Gmail App Password
//     },
//   });

//   await transporter.sendMail({
//     from: `"FairDeal Truck Parts" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

export const sendEmail = async (to, subject, html) => {
  console.log("📧 Sending email to:", to);
  console.log("📧 Using email:", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FairDeal Truck Parts" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent successfully");
};