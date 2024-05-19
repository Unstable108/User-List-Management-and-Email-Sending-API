const express = require("express");
const mongoose = require("mongoose");
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");

dotenv.config();
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
console.log("PORT:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Routes
app.use("/lists", listRoutes);
app.use("/lists", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
