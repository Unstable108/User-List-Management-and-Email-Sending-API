const List = require("../models/List");
const User = require("../models/User");
const { parseCSV } = require("../utils/csvHandler");
const fs = require("fs");

exports.addUsers = async (req, res) => {
  const listId = req.params.id;
  const list = await List.findById(listId);
  if (!list) return res.status(404).send("List not found");

  const results = [];
  const errors = [];
  const totalUsers = await User.countDocuments({});

  fs.createReadStream(req.file.path)
    .pipe(parseCSV())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const user of results) {
        try {
          if (!user.email || !user.name) {
            throw new Error("Missing required fields: name or email");
          }
          const properties = {};
          for (const prop of list.customProperties) {
            properties[prop.title] = user[prop.title] || prop.defaultValue;
          }
          await User.create({ name: user.name, email: user.email, properties });
        } catch (err) {
          errors.push({ user, error: err.message });
        }
      }
      const addedCount = results.length - errors.length;
      const response = {
        addedCount,
        errorCount: errors.length,
        totalCount: totalUsers + addedCount,
        errors,
      };
      res.status(200).send(response);
    });
};

exports.unsubscribeUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.unsubscribed = true;
    await user.save();
    res.status(200).send("User unsubscribed successfully");
  } else {
    res.status(404).send("User not found");
  }
};
