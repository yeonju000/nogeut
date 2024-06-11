const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reportForm', reportController.showReportForm);
router.post('/submitReport', reportController.submitReport);
router.get('/reports', reportController.listReports);
router.get('/reportList', reportController.renderReportListPage);
//router.get('/reportList/:reportNum',reportController.getReportDetail);
router.get('/report/:reportNum', reportController.viewReport);
router.get('/reportList', (req, res) => {
    res.render('reportList'); // reportConfirmation.ejs 파일을 렌더링합니다.
});

module.exports = router;