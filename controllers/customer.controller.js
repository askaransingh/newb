
// import { Job } from "../models/Job.js";
// import { transporter } from "../config/mailer.js";

// export const createJob = async (req, res) => {
//   const {
//     customerName,
//     customerEmail,
//     customerPhone,
//     problem,
//     address
//   } = req.body;

//   const job = await Job.create({
//     customerName,
//     customerEmail,
//     customerPhone,
//     serviceAddress: address,
//     problem
//   });

//   await transporter.sendMail({
//     to: process.env.ADMIN_EMAIL,
//     subject: "New Customer Job",
//     text: `
// Name: ${customerName}
// Email: ${customerEmail}
// Phone: ${customerPhone}
// Address: ${address.street}, ${address.city}

// Problem:
// ${problem}
// `
//   });

//   res.json({ message: "Job created", job });
// };

import { Job } from "../models/Job.js";
import { transporter } from "../config/mailer.js";

export const createJob = async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    problem,
    address
  } = req.body;

  const job = await Job.create({
    customerName,
    customerEmail,
    customerPhone,
    serviceAddress: address,
    problem
  });

  await transporter.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 New Customer Job",
    text: `
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}

Address:
${address.street}, ${address.city}, ${address.province} ${address.postalCode}

Problem:
${problem}
`
  });

  res.json({ message: "Job created successfully", job });
};