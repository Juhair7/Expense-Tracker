const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/file', authMiddleware, reportController.getMonthlyReport);

router.post('/report-file/email', authMiddleware, reportController.sendMonthlyReportEmail);

router.post('/report-file/email/pdf', authMiddleware, reportController.sendMonthlyReportEmailPdf);

router.post('/file/download', authMiddleware, reportController.downloadMonthlyReportPdf);

module.exports = router;
