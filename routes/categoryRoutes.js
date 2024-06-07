const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); // controllers 폴더에 categoryController.js 파일이 있어야 합니다


router.get("/categories/new", categoryController.new);
router.post("/categories/create", categoryController.create, categoryController.redirectView); // create와 redirectView가 정의되어 있어야 합니다
router.get("/categories/:id/edit", categoryController.edit);
router.put("/categories/:id/update", categoryController.update, categoryController.redirectView);
router.get("/categories/:id", categoryController.show, categoryController.showView); // showView 메서드를 추가했으므로 오류 해결
router.delete("/categories/:id/delete", categoryController.delete, categoryController.redirectView);

module.exports = router;
