const List = require("../models/List");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");

exports.createList = async (req, res) => {
  const { title, customProperties } = req.body;
  const list = new List({ title, customProperties });
  await list.save();
  res.status(201).send(list);
};

exports.sendEmailToList = async (req, res) => {
  const listId = req.params.id;
  const list = await List.findById(listId);
  if (!list) return res.status(404).send("List not found");

  const users = await User.find({ unsubscribed: false });
  const { subject, body } = req.body;

  for (const user of users) {
    let emailBody = body
      .replace(/\{\{name\}\}/g, user.name)
      .replace(/\{\{email\}\}/g, user.email);

    // Replace custom property placeholders with actual values or fallbacks
    for (const prop of list.customProperties) {
      const placeholder = `{{${prop.title}}}`;
      const value = user.properties.get(prop.title) || prop.defaultValue;
      emailBody = emailBody.replace(new RegExp(placeholder, "g"), value);
    }

    await sendEmail(user.email, subject, emailBody);
  }
  res.status(200).send("Emails sent successfully");
};
