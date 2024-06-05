const express = require("express");
const router = express.Router();
const mainhomeController = require("../controllers/mainhomeController");

router.get("/", mainhomeController.showLogin);
router.post("/", mainhomeController.handleLogin);
router.get("/mainHome", mainhomeController.showMainHome);

module.exports = router;
