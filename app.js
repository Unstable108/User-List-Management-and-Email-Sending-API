const express = require("express");
const path = require("path");
// const mongoose = require("mongoose");
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", function (req, res) {
  res.render("homePage");
});

// Routes
app.use("/lists", listRoutes);
app.use("/lists", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
