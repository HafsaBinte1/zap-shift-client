const express = require('express');
const { trackByCode } = require('../controllers/trackController');

const router = express.Router();

router.get('/:trackingCode', trackByCode);

module.exports = router;
