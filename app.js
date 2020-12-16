const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(express.json({ extended: true }));
app.use("/api/auth", require("./src/auth"));

async function start() {
  try {
    await mongoose
      .connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("db connected");
      });

    app.listen(PORT, () => {
      console.log(`App listen ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
