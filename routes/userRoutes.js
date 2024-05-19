const express = require("express");
const multer = require("multer");
const { addUsers, unsubscribeUser } = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/:id/users", upload.single("file"), addUsers);
router.post("/:id/unsubscribe", unsubscribeUser);

module.exports = router;
