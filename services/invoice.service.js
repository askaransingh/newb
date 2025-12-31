
// // // import { stripe } from "../config/stripe.js";

// // // export const createInvoiceAndSend = async (
// // //   customerEmail,
// // //   amount,
// // //   description
// // // ) => {
// // //   const customer = await stripe.customers.create({
// // //     email: customerEmail
// // //   });

// // //   await stripe.invoiceItems.create({
// // //     customer: customer.id,
// // //     amount: Math.round(Number(amount) * 100), // cents
// // //     currency: "cad",
// // //     description
// // //   });

// // //   const invoice = await stripe.invoices.create({
// // //     customer: customer.id,
// // //     collection_method: "send_invoice",
// // //     days_until_due: 3
// // //   });

// // //   await stripe.invoices.sendInvoice(invoice.id);
// // // };


// // // services/stripeInvoice.js
// // import { stripe } from "../config/stripe.js";

// // export const createInvoiceAndSend = async ({
// //   customerEmail,
// //   customerName,
// //   address,
// //   amount,
// //   description
// // }) => {
// //   const customer = await stripe.customers.create({
// //     email: customerEmail,
// //     name: customerName,
// //     address
// //   });

// //   await stripe.invoiceItems.create({
// //     customer: customer.id,
// //     amount: Math.round(amount * 100),
// //     currency: "cad",
// //     description
// //   });

// //   const invoice = await stripe.invoices.create({
// //     customer: customer.id,
// //     collection_method: "send_invoice",
// //     days_until_due: 3
// //   });

// //   await stripe.invoices.sendInvoice(invoice.id);

// //   return invoice.id;
// // };


// import Stripe from "stripe";
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Create invoice and send email via Stripe
// export const createInvoiceAndSend = async ({
//   customerEmail,
//   customerName,
//   address,
//   amount,
//   description
// }) => {
//   // ✅ Convert address to Stripe format
//   const stripeAddress = address
//     ? {
//         line1: address.street || "",
//         city: address.city || "",
//         state: address.province || "",
//         postal_code: address.postalCode || "",
//         country: "CA" // adjust dynamically if needed
//       }
//     : undefined;

//   // ✅ Create Stripe customer
//   const customer = await stripe.customers.create({
//     email: customerEmail,
//     name: customerName,
//     address: stripeAddress
//   });

//   // ✅ Add invoice item
//   await stripe.invoiceItems.create({
//     customer: customer.id,
//     amount: Math.round(amount * 100), // cents
//     currency: "cad",
//     description
//   });

//   // ✅ Create invoice
//   const invoice = await stripe.invoices.create({
//     customer: customer.id,
//     collection_method: "send_invoice",
//     days_until_due: 3
//   });

//   // ✅ Send invoice
//   await stripe.invoices.sendInvoice(invoice.id);

//   return invoice.id;
// };

// // Manual payout (admin-controlled)
// export const payMechanic = async ({ amount, mechanic }) => {
//   return await stripe.payouts.create({
//     amount: Math.round(amount * 100),
//     currency: "inr",
//     method: "standard",
//     destination: mechanic.bankDetails.accountNumber
//   });
// };

import { stripe } from "../config/stripe.js";

// export const createInvoiceAndSend = async ({
//   customerEmail,
//   customerName,
//   address,
//   amount,
//   description
// }) => {
//   // 1️⃣ Create customer
//   const customer = await stripe.customers.create({
//     email: customerEmail,
//     name: customerName,
//     address
//   });

//   // 2️⃣ Create DRAFT invoice
//   const invoice = await stripe.invoices.create({
//     customer: customer.id,
//     collection_method: "send_invoice",
//     days_until_due: 3,
//     auto_advance: false // ⛔ IMPORTANT
//   });

//   // 3️⃣ Attach invoice item TO THIS INVOICE
//   await stripe.invoiceItems.create({
//     customer: customer.id,
//     invoice: invoice.id, // ✅ CRITICAL FIX
//     amount: Math.round(Number(amount) * 100),
//     currency: "cad",
//     description
//   });

//   // 4️⃣ Finalize invoice (calculate totals)
//   const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

//   // 5️⃣ Send invoice
//   await stripe.invoices.sendInvoice(finalizedInvoice.id);

//   return finalizedInvoice.id;
// };


export const createInvoiceAndSend = async ({
  customerEmail,
  customerName,
  address,
  amount,
  description
}) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Invoice amount must be greater than zero");
  }

  // 1️⃣ Create customer
  const customer = await stripe.customers.create({
    email: customerEmail,
    name: customerName,
    address
  });

  // 2️⃣ Create draft invoice
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    days_until_due: 3,
    auto_advance: false // IMPORTANT
  });

  // 3️⃣ Attach invoice item to THIS invoice
  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id,
    amount: Math.round(Number(amount) * 100), // cents
    currency: "cad",
    description
  });

  // 4️⃣ Finalize
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  // 5️⃣ Send
  await stripe.invoices.sendInvoice(finalizedInvoice.id);

  return finalizedInvoice.id;
};