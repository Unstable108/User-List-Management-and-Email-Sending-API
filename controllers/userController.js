const List = require("../models/List");
const User = require("../models/User");
const { parseCSV } = require("../utils/csvHandler");
const fs = require("fs");
const path = require("path");

exports.addUsers = async (req, res) => {
  try {
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
        console.log("CSV file uploaded successfully:", req.file.path);
        for (const user of results) {
          try {
            if (!user.email || !user.name) {
              throw new Error("Missing required fields: name or email");
            }
            const properties = new Map();
            for (const prop of list.customProperties) {
              properties.set(prop.title, user[prop.title] || prop.defaultValue);
            }

            await User.create({
              name: user.name,
              email: user.email,
              properties,
            });
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

        // Optionally write errors to a CSV and include it in the response
        if (errors.length > 0) {
          const errorCsvPath = path.join(
            __dirname,
            "..",
            "uploads",
            "errors.csv"
          );
          const errorCsv = errors
            .map((e) => `${e.user.name},${e.user.email},${e.error}`)
            .join("\n");
          fs.writeFileSync(errorCsvPath, errorCsv);

          response.errorFile = "uploads/errors.csv";
        }

        res.status(200).send(response);
      });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while adding users" });
  }
};

exports.unsubscribeUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.unsubscribed = true;
      await user.save();
      console.log("User unsubscribed successfully:", email);
      res.status(200).send("User unsubscribed successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while unsubscribing the user" });
  }
};
