

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🏠 Personal Address
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: "Canada" },
  },

  // 🏢 Company Address
  companyAddress: {
    companyName: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: "Canada" },
  },

  billingAddress: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
  },
  phone: {
    type: String,
    required: true
  }
});

export default userSchema;
// const User = mongoose.model("User", userSchema);
// export default User;