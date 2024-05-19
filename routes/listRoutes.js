const express = require("express");
const {
  createList,
  sendEmailToList,
} = require("../controllers/listController");

const router = express.Router();

router.post("/", createList);
router.post("/:id/send-email", sendEmailToList);

module.exports = router;
