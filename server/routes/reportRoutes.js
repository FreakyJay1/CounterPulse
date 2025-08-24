const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const auth = require('../utils/auth');

router.get('/shop', auth(['owner']), ReportController.generateShopReport);

module.exports = router;
