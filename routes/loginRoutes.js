const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.get("/Login", loginController.login);
router.post("/Login", loginController.postLogin);

module.exports = router;
