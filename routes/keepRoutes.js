const express = require('express');
const router = express.Router();
const keepController = require("../controllers/keepController");
const detailedController = require("../controllers/detailedController");

// Keep routes
router.get("/keeps", keepController.index);

// Student detail route
router.get("/Detail/student/:stdNum", detailedController.studentDetail);

module.exports = router;
