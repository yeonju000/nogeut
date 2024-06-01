const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get("/categories", categoryController.index);
router.get("/categories/new", categoryController.new);
router.post("/categories/create", categoryController.create, categoryController.redirectView);
router.get("/categories/:id/edit", categoryController.edit);
router.put("/categories/:id/update", categoryController.update, categoryController.redirectView);
router.get("/categories/:id", categoryController.show, categoryController.showView);
router.delete("/categories/:id/delete", categoryController.delete, categoryController.redirectView);
router.get("/students", categoryController.getSortedStudents);
router.get("/seniors", categoryController.getSortedSeniors);

module.exports = router;
