
// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   street: String,
//   city: String,
//   province: String,
//   postalCode: String,
//   country: { type: String, default: "Canada" }
// });

// const jobSchema = new mongoose.Schema({
//   customerName: String,
//   customerEmail: String,
//   customerPhone: String,

//   serviceAddress: addressSchema,

//   problem: String,

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   mechanic: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Mechanic"
//   },

//   mechanicNote: String,
//   amount: Number,

//   status: {
//     type: String,
//     enum: [
//       "Pending",
//       "Assigned",
//       "Completed",
//       "Invoiced",
//       "Paid"
//     ],
//     default: "Pending"
//   },

//   invoiceId: String,
//   isMechanicPaid: { type: Boolean, default: false }

// }, { timestamps: true });

// export const Job = mongoose.model("Job", jobSchema);

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  province: String,
  postalCode: String,
  country: { type: String, default: "Canada" }
});

const jobSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,

  serviceAddress: addressSchema,

  problem: String,

  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mechanic"
  },

  mechanicNote: String,
  amount: Number,

  status: {
    type: String,
    enum: ["Pending", "Assigned", "Completed", "Invoiced", "Paid"],
    default: "Pending"
  },

  invoiceId: String,
  isMechanicPaid: { type: Boolean, default: false }

}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);