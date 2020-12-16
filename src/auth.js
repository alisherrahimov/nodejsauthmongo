const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("./model/User");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

//api/auth/register
router.post(
  "/register",
  [
    check("email", "not Email").isEmail(),
    check("password", "min symbol 6").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrent email and password",
        });
      }
      const { email, password } = req.body;
      console.log(req.body);

      const borbulsa = await User.findOne({ email });
      if (borbulsa) {
        return res.status(400).json({ message: "you already registered" });
      }

      const parolHash = await bcrypt.hash(password, 12);
      console.log(parolHash);
      const user = new User({ email, password: parolHash });
      await user.save();
      res.status(201).json({ message: "User Registered" });
    } catch (error) {
      res.status(500).json({ message: "Serverda xatolik" });
      console.log(error);
    }
  }
);

//api/auth/login
router.post(
  "/login",
  [
    check("email", "Not email")
      .normalizeEmail()
      .isEmail(),
    check("password", "Password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrent email and password not Enter",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email or Password Incorrent" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Email or Password Incorrent" });
      }

      const token = jwt.sign({ userID: user.id }, process.env.jwt, {
        expiresIn: "1h",
      });

      res.json({ token, userID: user.id });
    } catch (error) {
      res.status(500).json({ message: "Serverda xatolik" });
    }
  }
);

module.exports = router;
