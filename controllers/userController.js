
import bcrypt from "bcryptjs";

export const userController = (UserModel) => ({
  // signup: async (req, res) => {
  //   try {
  //     const {
  //       name,
  //       email,
  //       password,
  //       address,
  //       companyAddress,
  //       billingAddress,
  //       shippingAddress,
  //     } = req.body;

  //     const hashed = await bcrypt.hash(password, 10);

  //     const user = await UserModel.create({
  //       name,
  //       email,
  //       password: hashed,
  //       address,
  //       companyAddress,
  //       billingAddress,   // ✅ stored
  //       shippingAddress,  // ✅ stored
  //     });

  //     res.status(201).json({
  //       message: "User created",
  //       user,
  //     });
  //   } catch (err) {
  //     res.status(400).json({ error: err.message });
  //   }
  // },
  signup: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,              // ✅ added
        address,
        companyAddress,
        billingAddress,
        shippingAddress,
      } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        name,
        email,
        password: hashed,
        phone,              // ✅ stored
        address,
        companyAddress,
        billingAddress,
        shippingAddress,
      });

      res.status(201).json({
        message: "User created",
        user,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      res.json({
        message: "Login successful",
        user,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
});