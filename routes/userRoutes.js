import express from "express";
import mongoose from "mongoose";
import { userController } from "../controllers/userController.js";
// import userSchema from "../models/User.js";
import { connectToUserDB } from "../database.js";
import userSchema from "../models-users/User.js";
// import { connectToUserDB } from "../config/dbUser.js";

const router = express.Router();

let UserModel;
(async () => {
  const conn = await connectToUserDB();

  UserModel = conn.model("User", userSchema);
})();

router.post("/signup", (req, res) => userController(UserModel).signup(req, res));
router.post("/login", (req, res) => userController(UserModel).login(req, res));


// Admin routes
router.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, email, password, address, companyAddress } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashed,
      address,
      companyAddress, // ✅ added
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;