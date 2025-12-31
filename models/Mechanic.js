
// import mongoose from "mongoose";

// const mechanicSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   phone: String,
//   skills: String,

//   documents: {
//     journeyman: String,
//     redSeal: String,
//     insurance: String,
//     businessInsurance: String,
//     drivingLicense: String
//   },

//   bankDetails: {
//     accountNumber: String,
//     ifsc: String,
//     name: String
//   },

//   isApproved: { type: Boolean, default: false }
// }, { timestamps: true });

// export const Mechanic = mongoose.model("Mechanic", mechanicSchema);

import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  skills: String,

  documents: {
    journeyman: String,
    redSeal: String,
    insurance: String,
    businessInsurance: String,
    drivingLicense: String
  },

  bankDetails: {
    accountNumber: String,
    ifsc: String,
    name: String
  },

  agreedToTerms: Boolean,

  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export const Mechanic = mongoose.model("Mechanic", mechanicSchema);