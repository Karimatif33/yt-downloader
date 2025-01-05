const express = require('express');
const formatsController = require('../controllers/formatsController');
const router = express.Router();

router.get('/', formatsController.getFormats);

module.exports = router;
