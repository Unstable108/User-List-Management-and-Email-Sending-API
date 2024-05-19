const mongoose = require("mongoose");

const customPropertySchema = new mongoose.Schema({
  title: String,
  defaultValue: String,
});

const listSchema = new mongoose.Schema({
  title: String,
  customProperties: [customPropertySchema],
});

const List = mongoose.model("List", listSchema);

module.exports = List;
