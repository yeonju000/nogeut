const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");

router.get("/chat", chatController.index);
module.exports = router;
